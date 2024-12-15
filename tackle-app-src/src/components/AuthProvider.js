/**
 * AuthProvider.js
 * 
 * This component provides authentication context, with methods for user authentication.
 * Also includes various variables needed by various components, most importantly the user profile.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";
import { emptyProfile } from '../components/Profile';
const AuthContext = createContext();

/**
 * @typedef {import('./Profile.js').Profile} Profile
 */

// JSX style objects used control border colors for light/darkmode.
const darkModeBorders = {
    borderColor: "white"
}
const lightModeBorders = {
    borderColor: "black"
}

// Specifies that all axios requests should contain the user's token, if available.
axios.interceptors.request.use(config => {
    const localToken = localStorage.getItem('token');
    const sessionToken = sessionStorage.getItem('token');

    if (localToken) {
        config.headers['Authorization'] = localToken;
    } else if (sessionToken) {
        config.headers['Authorization'] = sessionToken;
    }

    return config;
});

/**
 * Finds all matching keys within a pair of similar objects that have different values,
 * and returns an array of said keys' names as strings.
 * @param {*} objA - First object to compare.
 * @param {*} objB - Second object to compare.
 * @returns {Array.<string>} An array of all keys with different values, as strings.
 */
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

/**
 * AuthProvider component provides the authentication provider, with functions
 * and variables that are available for any child components.
 * @param {*} children - Child elements to wrap in AuthProvider.
 * @returns {JSX.Element} AuthProvider element.
 */
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    var profileJsonString = localStorage.getItem('profile');

    /** @type Profile */
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
    const [weatherData, setWeatherData] = useState(undefined);

    /**
     * Will take token from storage and log into profile using it
     * @function
     * @async
     */
    const verifyToken = async () => {
        try {
            const response = await axios.post("http://localhost:5000/verifyToken", {});
            if (response.status === 200) {
                const username = response.data.username;
                login(username);
            }
        } catch (error) {
            console.error("User token login failure:", error.response?.data || error.message);
            //Display error to user

            //remove faulty tokens
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
        }
    }
    // attempt login with token if token available
    useEffect(() => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            verifyToken();
        }
        updateBorderStyle(profileInit);
    }, []);
    
    /**
     * Request weather data from server, or uses cached weather data if getWeatherData has already been
     * called during session.
     * @param {string} zip - ZIP code of location to recieve data from, as string 
     * @returns response from openweathermap.com for weather in ZIP
     * @function
     * @async
     */
    const getWeatherData = async (zip) => {
        if (!weatherData) {
            const response = await axios.post("http://localhost:5000/getWeatherData", {zip});
            setWeatherData(response);
            return response;
        } else {
            return weatherData;
        }
    };

    /**
     * Logs in to user account.
     * @param {string} username - User for user to login as.
     * @function
     */
    const login = (username) => {
        setIsLoggedIn(true);
        triggerProfileLoad(username);
    };

    /**
     * Log out of user account.
     * @function
     */
    const logout = () => {
        setIsLoggedIn(false);
        setBorderStyle(lightModeBorders);
        setProfileDirectly({...emptyProfile});

        localStorage.removeItem('token');
        sessionStorage.removeItem('token');

        let result = document.body.classList.contains("dark-mode-body");
        if(result === true){
            document.body.classList.remove("dark-mode-body");
        }
    };

    /**
     * Update border and document body style to match light/darkmode setting.
     * @param {Profile} newProfile - Profile to load dark/lightmode setting from.
     */
    const updateBorderStyle = (newProfile = profile) => {
        var element = document.body;
        if (newProfile.darkmode) {
            setBorderStyle(darkModeBorders);
            element.classList.add("dark-mode-body");
        } else {
            setBorderStyle(lightModeBorders);
            element.classList.remove("dark-mode-body");
        }
    }

    /**
     * Sets profile variable, while also saving the new profile to the server.
     * @param {Profile} newProfile - Profile object to set profile to.
     * @function
     */
    const setProfile = (newProfile) => {
        triggerProfileSave(newProfile);
        setProfileDirectly(newProfile);
        updateBorderStyle(newProfile);
    }

    /**
     * Adds a new user profile to database from profile object, with a specified password.
     * @param {Profile} newProfile - Profile object to add to database.
     * @param {string} password - Password of profile, as string.
     * @function
     * @async
     */
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
                console.log("User created!");
                const token = response.data.token;
                sessionStorage.setItem('token', token);
            }
        } catch (error) {
            console.error("User info insertion failure:", error.response?.data || error.message);
            //Display error to user
        }
    }

    /**
     * Saves new profile information to database, or locally if not logged in.
     * @param {Profile} newProfile - Profile object to save to database.
     * @function
     * @async
     */
    const triggerProfileSave = async (newProfile = profile) => {
        if (!isLoggedIn) {
            localStorage.setItem('profile', JSON.stringify(newProfile));
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

    /**
     * Loads a user profile from database.
     * @param {string} username - Username for profile to load from database. 
     * @function
     * @async
     */
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
                if (response.data.pfp !== null) {
                    const blob = new Blob([ new Uint8Array(response.data.pfp.data) ], { type: `image/${profileLogin.pfpFileType}` });
                    const blobURL = URL.createObjectURL(blob);
                    profileLogin.pfpURL = blobURL;
                }

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

    /**
     * Sets last location variable to location, while also formatting it if improperly formatted.
     * @param {string} location - Location to set as last location. 
     * @function
     */
    const setLastLocation = (location) => {
        if (location.endsWith(" (C&R)")) {
            location = location.substring(0, location.length - 6);
        }
        setLastLocationDirectly(location);
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, profile, lastLocation, borderStyle, navBack, setNavBack, getWeatherData, login, logout, setIsLoggedIn, setProfile, setProfileDirectly, triggerProfileLoad, triggerProfileCreate, setLastLocation, updateBorderStyle, setPfpFile }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * @typedef {Object} AuthContext
 * @property {boolean} isLoggedIn
 * @property {Profile} profile 
 * @property {string} lastLocation
 * @property {string} navBack
 */

/** @returns {AuthContext} */
export const useAuth = () => useContext(AuthContext);