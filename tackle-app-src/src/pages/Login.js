import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        //Authenticate user (Username: user, Password: pass)
        try {
            const response = await axios.post("http://localhost:5000/api/authenticate", {username, password});
            console.log(response);
            if (response.status === 200) {
                console.log("User authenticated!");
                //remove Login button from navbar
                //load user preferences (dark/light mode, fish list, profile pic, etc.)
                navigate("/");
            }
            else if(response.status === 401){
                console.error("Authentication failed: Username already exists");
            }
        } catch (error) {
            console.error("Authentication failed:", error.response?.data || error.message);
            //Display error to user
        }

    };
    return (
        <>
        <div>
            <h2>Login</h2>

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

            <Link id={`createaccount-button`} key={`createaccount-button`} to={`/CreateAccount`}><button>Create Account</button></Link>
        </div>
        </>
    );
};