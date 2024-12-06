import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../components/AuthProvider";

export default function DeleteAccount() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { logout, borderStyle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        //Create account for user
        try {
            const response = await axios.post("http://localhost:5000/authenticate", {username, password});
            if (response.status === 200) {

                const response = await axios.post("http://localhost:5000/removeUser", {username});
                if (response.status === 200) {
                    console.log("Account deleted!");
                    //Display to user that account deletion was successful
                    logout(username);    //Flag AuthProvider that user is logged out
                    navigate("/");
                }
                else if(response.status === 401){
                    console.error("Account deletion failed: Username doesn't exist");
                }
            }
        } catch (error) {
            console.error("Account deletion failed:", error.response?.data || error.message);
            //Display error to user
        }

    };
    return (
        <div className = "login_container">
            <div className = "login_box" style={borderStyle}>
                <h2>Delete Account</h2>
                <form onSubmit = {handleSubmit}>
                    <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br />
                <button type="submit">Confirm Deletion</button>
                </form>
            </div>
        </div>
    );
};