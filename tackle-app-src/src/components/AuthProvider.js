import React, { createContext, useContext, useState } from 'react';
import axios from "axios";
import { genericProfile } from '../components/Profile';
const AuthContext = createContext();

const darkModeBorders = {
    borderColor: "white"
}
const lightModeBorders = {
    borderColor: "black"
}

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
    const [profile, setProfileDirectly] = useState({...genericProfile});
    const [lastLocation, setLastLocationDirectly] = useState("");
    const [borderStyle, setBorderStyle] = useState(lightModeBorders);

    const login = (username) => {
        setIsLoggedIn(true);
        triggerProfileLoad(username);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setBorderStyle(lightModeBorders);
        setProfileDirectly({...genericProfile});
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
        if(isLoggedIn){
            triggerProfileSave(newProfile);
        }
        setProfileDirectly(newProfile);
        updateBorderStyle(newProfile);
    }

    //create account
    const triggerProfileCreate = async (newProfile, password) => {

        try {
            var username = newProfile.username;
            var darkmode = newProfile.darkmode;
            var nickname = newProfile.nickname;
            var gender = newProfile.gender;
            //let fishlist = newProfile.fishlist;
            const response = await axios.post("http://localhost:5000/insertUser", {username, password, darkmode, nickname, gender});
            if (response.status === 200) {
                console.log("Inserted ->\nUsername: " + username + "\nDarkmode: " + darkmode + "\nNickname: " + nickname + "\nGender: " + gender);

            }
        } catch (error) {
            console.error("User info insertion failure:", error.response?.data || error.message);
            //Display error to user
        }
    }

    //update user account
    const triggerProfileSave = async (newProfile = profile) => {
        const keys = findDifferentKeys(newProfile, profile);
        console.log(keys);

        try {
            var username = newProfile.username;
            var darkmode = newProfile.darkmode;
            var nickname = newProfile.nickname;
            var gender = newProfile.gender;
            //let fishlist = newProfile.fishlist;
            const response = await axios.post("http://localhost:5000/updateUserInfo", {username, darkmode, nickname, gender});
            if (response.status === 200) {
                console.log("Saved ->\nUsername: " + username + "\nDarkmode: " + darkmode + "\nNickname: " + nickname + "\nGender: " + gender);

            }
        } catch (error) {
            console.error("User info update failure:", error.response?.data || error.message);
            //Display error to user
        }
    }

    //load user account
    const triggerProfileLoad = async (username) => {

        try {
            const response = await axios.post("http://localhost:5000/loadUserInfo", {username});
            if (response.status === 200) {

                //Get response
                profile.username = response.data.Username;
                profile.darkmode = response.data.darkmode;
                profile.nickname = response.data.nickname;
                profile.gender = response.data.gender;
                profile.pfpFileType = response.data.pfpFileType;

                console.log(profile.pfpFileType);

                //fishlist: response.data.fishlist
                console.log("Retreived ->\nUsername: " + profile.username + "\nDarkmode: " + profile.darkmode + "\nNickname: " + profile.nickname + "\nGender: " + profile.gender);
                
                //Set profile picture (must convert from Binary data to a Blob and then create a Blob url)
                const blob = new Blob([ new Uint8Array(response.data.pfp.data) ], { type: `image/${profile.pfpFileType}` });
                const blobURL = URL.createObjectURL(blob);

                console.log("response: " + JSON.stringify(response.data.pfp) + "blob: " + blob + "blobURL: " + blobURL);
                setProfileDirectly({...profile, pfpURL: blobURL});

                //Set light for doc body
                let result = document.body.classList.contains("dark-mode-body");
                if(!profile.darkmode && result === true){
                    document.body.classList.remove("dark-mode-body");
                }
                else if(profile.darkmode && result === false){
                    document.body.classList.add("dark-mode-body");
                }
                updateBorderStyle(profile);
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
        <AuthContext.Provider value={{ isLoggedIn, profile, lastLocation, borderStyle, login, logout, setIsLoggedIn, setProfile, setProfileDirectly, triggerProfileLoad, triggerProfileCreate, setLastLocation, updateBorderStyle }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);