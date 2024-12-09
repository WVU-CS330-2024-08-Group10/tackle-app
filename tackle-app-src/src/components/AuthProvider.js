import React, { createContext, useContext, useState } from 'react';
import axios from "axios";
import { emptyProfile } from '../components/Profile';
const AuthContext = createContext();

const darkModeBorders = {
    borderColor: "white"
}
const lightModeBorders = {
    borderColor: "black"
}

// find different keys between objA and objB and returns an array of them.
// completely unused
function findDifferentKeys(objA, objB) {
    let setA = new Set(Object.values(objA));
    let setB = new Set(Object.values(objB));

    let difference = new Set(setA);
    for (let elem of setB) {
        difference.delete(elem)
    }
    let differenceArray = Array.from(difference); // making Array from a Set

    const keysArray = [];
    for (let value of Object.values(differenceArray)) {
        keysArray.push(Object.keys(objA).filter(key => objA[key] === value));
    }

    return keysArray;
}

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    var profileJsonString = localStorage.getItem('profile');
    var profileInit = null;
    if (profileJsonString === null) {
        profileInit = {...emptyProfile};
        localStorage.setItem('profile', JSON.stringify(profileInit));
    } else {
        profileInit = JSON.parse(profileJsonString);
    }

    const [pfpFile, setPfpFile] = useState(null);
    const [profile, setProfileDirectly] = useState(profileInit);
    const [lastLocation, setLastLocationDirectly] = useState("");
    const [navBack, setNavBack] = useState("/");
    const [borderStyle, setBorderStyle] = useState(lightModeBorders);

    const login = (username) => {
        setIsLoggedIn(true);
        triggerProfileLoad(username);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setBorderStyle(lightModeBorders);
        setProfileDirectly({...emptyProfile});
        let result = document.body.classList.contains("dark-mode-body");
        if(result === true){
            document.body.classList.remove("dark-mode-body");
        }
    };

    const updateBorderStyle = (newProfile = profile) => {
        if (newProfile.darkmode) {
            setBorderStyle(darkModeBorders);
        } else {
            setBorderStyle(lightModeBorders);
        }
    }

    const setProfile = (newProfile) => {
        triggerProfileSave(newProfile);
        setProfileDirectly(newProfile);
        updateBorderStyle(newProfile);
    }

    //create account
    const triggerProfileCreate = async (newProfile, password) => {

        try {
            var username = newProfile.username;
            var darkmode = newProfile.darkmode;
            var nickname;
            if (newProfile.nickname === "Unregistered User") {
                nickname = username;
            } else {
                nickname = newProfile.nickname;
            }
            var gender = newProfile.gender;
            var fishlist = newProfile.fishlist;
            const response = await axios.post("http://localhost:5000/insertUser", {username, password, darkmode, nickname, gender, fishlist});
            if (response.status === 200) {
                //console.log("Inserted ->\nUsername: " + username + "\nDarkmode: " + darkmode + "\nNickname: " + nickname + "\nGender: " + gender + "\nFishlist: " + JSON.stringify(fishlist));

            }
        } catch (error) {
            console.error("User info insertion failure:", error.response?.data || error.message);
            //Display error to user
        }
    }

    //update user account
    const triggerProfileSave = async (newProfile = profile) => {
        if (!isLoggedIn) {
            localStorage.setItem('profile', JSON.stringify(newProfile));
            console.log("Not logged in, saved to local profile");
            return;
        }

        try {
            var username = newProfile.username;
            var darkmode = newProfile.darkmode;
            var nickname = newProfile.nickname;
            var gender = newProfile.gender;
            var fishlist = newProfile.fishlist;
            const response = await axios.post("http://localhost:5000/updateUserInfo", {username, darkmode, nickname, gender, fishlist});
            if (response.status === 200) {
                //console.log("Saved ->\nUsername: " + username + "\nDarkmode: " + darkmode + "\nNickname: " + nickname + "\nGender: " + gender, + "\nFishlist: " + fishlist);

            }
        } catch (error) {
            console.error("User info update failure:", error.response?.data || error.message);
            //Display error to user
        }

        if (pfpFile !== null) { // PFP has updated
            try {
                let fileType = pfpFile.type.substring(pfpFile.type.indexOf('/') + 1);

                //Sending image to Server.js
                const formData = new FormData();
                formData.append("pfp", pfpFile);
                formData.append("pfpFileType", fileType);
                formData.append("username", profile.username);
        
                await axios.post("http://localhost:5000/uploadPFP", formData, {
                    headers: {
                    "Content-Type": "multipart/form-data",
                    }
                });

                setPfpFile(null);
            } catch (error) {
                console.error("User pfp update failure:", error.response?.data || error.message);
                //Display error to user
            }
        }
    }

    //load user account
    const triggerProfileLoad = async (username) => {

        try {
            const response = await axios.post("http://localhost:5000/loadUserInfo", {username});
            if (response.status === 200) {

                let profileLogin = {...profile};

                //Get response
                profileLogin.username = response.data.Username;
                profileLogin.darkmode = response.data.darkmode;
                profileLogin.nickname = response.data.nickname;
                profileLogin.gender = response.data.gender;
                profileLogin.pfpFileType = response.data.pfpFileType;
                profileLogin.fishlist = JSON.parse(response.data.fishlist);
                //console.log("Retreived ->\nUsername: " + profile.username + "\nDarkmode: " + profile.darkmode + "\nNickname: " + profile.nickname + "\nGender: " + profile.gender + "\nFishlist: " + JSON.stringify(profile.fishlist));
                
                //Set profile picture (must convert from Binary data to a Blob and then create a Blob url)
                const blob = new Blob([ new Uint8Array(response.data.pfp.data) ], { type: `image/${profileLogin.pfpFileType}` });
                const blobURL = URL.createObjectURL(blob);
                profileLogin.pfpURL = blobURL;

                //Set light for doc body
                let result = document.body.classList.contains("dark-mode-body");
                if(!profileLogin.darkmode && result === true){
                    document.body.classList.remove("dark-mode-body");
                }
                else if(profileLogin.darkmode && result === false){
                    document.body.classList.add("dark-mode-body");
                }
                updateBorderStyle(profileLogin);
                setProfileDirectly(profileLogin);
            }
        } catch (error) {
            console.error("User info retrieval failure:", error.response?.data || error.message);
            //Display error to user
        }
    }

    const setLastLocation = (location) => {
        if (location.endsWith(" (C&R)")) {
            location = location.substring(0, location.length - 6);
        }
        setLastLocationDirectly(location);
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, profile, lastLocation, borderStyle, navBack, setNavBack, login, logout, setIsLoggedIn, setProfile, setProfileDirectly, triggerProfileLoad, triggerProfileCreate, setLastLocation, updateBorderStyle, setPfpFile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);