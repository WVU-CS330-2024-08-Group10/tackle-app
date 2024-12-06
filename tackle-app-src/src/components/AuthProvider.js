import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUsername] = useState(null);
    const[brightNess, setBrightness] = useState(0);
    const [pfp, setPFP] = useState("../assets/jeremyPfp.jpg");

    const login = (userData) => {
        setIsLoggedIn(true);
        setUsername(userData);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUsername(null);
    };

    const toggleBrightness = (brightnessData) => {
        setBrightness(brightnessData);
    };

    const changePFP = (pfp) => {
        setPFP(pfp);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userName, brightNess, pfp, login, logout, toggleBrightness, changePFP }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);