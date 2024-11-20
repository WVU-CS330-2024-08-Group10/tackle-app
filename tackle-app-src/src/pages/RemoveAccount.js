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
            const response = await axios.post("http://localhost:5000/api/authenticate", {username, password});
            if (response.status === 200) {

                const response = await axios.post("http://localhost:5000/api/remove", {username});
                if (response.status === 200) {
                    console.log("Account deleted!");
                    //Display to user that account deletion was successful
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
        <div>
            <h2>Remove Account</h2>
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
    );
};