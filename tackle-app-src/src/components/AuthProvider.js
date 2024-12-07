import React, { createContext, useContext, useState, useEffect } from 'react';
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
    const [isLoggedIn, setIsLoggedIn] = useState(0);
    const [profile, setProfileDirectly] = useState(genericProfile);
    const [oldProfile, setOldProfile] = useState(genericProfile);
    const [lastLocation, setLastLocationDirectly] = useState("");
    const [borderStyle, setBorderStyle] = useState(lightModeBorders);

    const login = (username) => {
        setIsLoggedIn(true);
        triggerProfileLoad(username);
    };

    const logout = () => {
        setIsLoggedIn(false);
    };

    //effect for logout
    useEffect(() => {
        if (isLoggedIn === false) {
            setProfile(genericProfile);
            setIsLoggedIn(0);
        }
    }, [isLoggedIn]);

    const updateBorderStyle = (newProfile = profile) => {
        if (newProfile.darkmode) {
            setBorderStyle(darkModeBorders);
        } else {
            setBorderStyle(lightModeBorders);
        }
    }

    const setProfile = (newProfile) => {
        if(isLoggedIn === true){
            triggerProfileSave(newProfile);
        }
        setOldProfile(profile);
        setProfileDirectly(newProfile);
        updateBorderStyle(newProfile);
    }

    const triggerProfileSave = async (newProfile = profile) => {
        const keys = findDifferentKeys(newProfile, oldProfile);
        console.log(keys);

        // TODO: make axios request to save modified profile properties under "keys"

        // the "keys" array will contain all object properties that have been modified by a call to set profile.
        // In theory, an axios request can be made here containing every modified key/value pair to send all the 
        // new values to the azure database, rather than sending the entire profile object.

        // of course, since there is a disconnect between the names of some object properties in the profile object
        // and the name of corresponding column in the Azure database (for example, light/dark mode being called 
        // "darkmode" in the profile object and "LightDark" in the Azure database) so server.js will have to be 
        // updated to contain all the pairs of object property names and azure database names

        try {
            let username = newProfile.username;
            let darkmode = newProfile.darkmode;
            let nickname = newProfile.nickname;
            let pfp = newProfile.pfp;
            let gender = newProfile.gender;
            //let fishlist = newProfile.fishlist;
            const response = await axios.post("http://localhost:5000/updateUserInfo", {username, darkmode, nickname, pfp, gender});
            if (response.status === 200) {
                console.log("Saved ->\nUsername: " + username + "\nDarkmode: " + darkmode + "\nNickname: " + nickname + "\nGender: " + gender);

            }
        } catch (error) {
            console.error("User info update failure:", error.response?.data || error.message);
            //Display error to user
        }

        setOldProfile(newProfile);
    }

    const triggerProfileLoad = async (username) => {

        // TODO: make axios request to load user profile properties
        //Load user preferences (dark/light mode, fish list, profile pic, etc.)
        try {
            const response = await axios.post("http://localhost:5000/loadUserInfo", {username});
            if (response.status === 200) {
                profile.username = response.data.Username;
                profile.darkmode = response.data.darkmode;
                profile.nickname = response.data.nickname;
                profile.pfpUrl = response.data.pfp;
                profile.gender = response.data.gender;
                //profile.fishlist = response.data.fishlist;
                console.log("Received ->\nUsername: " + profile.username + "\nDarkmode: " + profile.darkmode + "\nNickname: " + profile.nickname + "\nGender: " + profile.gender);
                //assign the other data to profile properties

                //Set light for doc body
                let result = document.body.classList.contains("dark-mode-body");
                if(!profile.darkmode && result === true){
                    document.body.classList.remove("dark-mode-body");
                }
                else if(profile.darkmode && result === false){
                    document.body.classList.add("dark-mode-body");
                }

                updateBorderStyle();
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
        <AuthContext.Provider value={{ isLoggedIn, profile, lastLocation, borderStyle, login, logout, setIsLoggedIn, setProfile, triggerProfileLoad, setLastLocation }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);