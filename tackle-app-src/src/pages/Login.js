import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        /*This portion needs actual authentication stuffs*/
        if (username === "user" && password === "pass") {

            localStorage.setItem('isLogged', 'true');
            localStorage.setItem('username', username);
            
            navigate("/")
        } else {
            alert("Invalid credentials, please try again. For temp, its user and pass.");
        }

    };
    return (
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
        </div>
    );
};
