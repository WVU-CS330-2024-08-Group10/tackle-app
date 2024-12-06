import React, { createContext, useContext, useState } from 'react';
import { genericProfile } from '../components/Profile';

const AuthContext = createContext();

const borderWhite = {
    borderColor: "white"
}
const borderBlack = {
    borderColor: "black"
}

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profile, setProfileDirectly] = useState(genericProfile);
    const [borderStyle, setBorderStyle] = useState(borderBlack);

    const login = (userProfile) => {
        setIsLoggedIn(true);
        setProfile(userProfile);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setProfile(genericProfile);
    };

    const updateBorderStyle = () => {
        if (!profile.darkmode) {
            setBorderStyle(borderWhite);
        } else {
            setBorderStyle(borderBlack);
        }
    }

    const setProfile = (newProfile) => {
        setProfileDirectly(newProfile);
        updateBorderStyle();
    }

    return (<>
        <AuthContext.Provider value={{ isLoggedIn, profile, borderStyle, login, logout, setIsLoggedIn, setProfile }}>
            {children}
        </AuthContext.Provider>
    </>);
};

export const useAuth = () => useContext(AuthContext);