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

    const [profile, setProfileDirectly] = useState(profileInit);
    const [lastLocation, setLastLocationDirectly] = useState("");
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
            var nickname = newProfile.nickname;
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

        const keys = findDifferentKeys(newProfile, profile);
        console.log(keys);

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
                profile.fishlist = JSON.parse(response.data.fishlist);
                //console.log("Retreived ->\nUsername: " + profile.username + "\nDarkmode: " + profile.darkmode + "\nNickname: " + profile.nickname + "\nGender: " + profile.gender + "\nFishlist: " + JSON.stringify(profile.fishlist));
                
                //Set profile picture (must convert from Binary data to a Blob and then create a Blob url)
                const blob = new Blob([ new Uint8Array(response.data.pfp.data) ], { type: `image/${profile.pfpFileType}` });
                const blobURL = URL.createObjectURL(blob);
                profile.pfpURL = blobURL;

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