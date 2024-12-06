import React, { createContext, useContext, useState } from 'react';
import axios from "axios";
import { genericProfile } from '../components/Profile';
const AuthContext = createContext();

const borderWhite = {
    borderColor: "white"
}
const borderBlack = {
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
    const [profile, setProfileDirectly] = useState(genericProfile);
    const [oldProfile, setOldProfile] = useState(genericProfile);
    const [lastLocation, setLastLocationDirectly] = useState("");
    const [borderStyle, setBorderStyle] = useState(borderBlack);

    const login = (userProfile) => {
        setIsLoggedIn(true);
        setProfile(userProfile);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setProfile(genericProfile);
    };

    const updateBorderStyle = (newProfile = profile) => {
        if (newProfile.darkmode) {
            setBorderStyle(borderWhite);
        } else {
            setBorderStyle(borderBlack);
        }
    }

    const setProfile = (newProfile) => {
        setProfileDirectly(newProfile);
        triggerProfileSave(newProfile);
        updateBorderStyle(newProfile);
    }

    const triggerProfileSave = (newProfile = profile) => {
        const keys = findDifferentKeys(newProfile, oldProfile);
        console.log(keys);

        // TODO: make axios request to save modified profile properties under "keys"

        setOldProfile(newProfile);
    }

    const setLastLocation = (location) => {
        if (location.endsWith(" (C&R)")) {
            location = location.substring(0, location.length - 6);
        }
        setLastLocationDirectly(location);
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, profile, lastLocation, borderStyle, login, logout, setIsLoggedIn, setProfile, setLastLocation }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);