import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        //Create account for user
        try {
            const response = await axios.post("http://localhost:5000/api/insert", {username, password});
            if (response.status === 200) {
                console.log("Account created!");
                //remove Login button from navbar
                navigate("/");
            }
        } catch (error) {
            console.error("Account creation failed:", error.response?.data || error.message);
            //Display error to user
        }

    };
    return (
        <div>
            <h2>Create Account</h2>
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
            <button type="submit">Login</button>
            </form>
        </div>
    );
};