import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from 'react-router-dom';
import { useAuth } from "../components/AuthProvider";
const reqs = require('../components/AccountReqs.json');


const errorsInit = {
    password: 0,
    showPassword: false
}

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({...errorsInit});
    const navigate = useNavigate();
    const { login, brightNess, toggleBrightness } = useAuth();
    let styles = {};

    if (brightNess === 0) {
        styles = {borderColor: "black"};
    } else {
        styles = {borderColor: "white"};
    }

    const checkPassword = (e) => {
        let error = 0;
        let input = e.target.value;

        // check if meets minimum length
        if (input.length < reqs.password.minLength) error |= reqs.error.MIN_LENGTH;
        // check if meets maximum length
        if (input.length > reqs.password.maxLength) error |= reqs.error.MAX_LENGTH;
        // check if only ASCII
        if (!input.match(reqs.password.regExOnlyASCII)) error |= reqs.error.REGEX_ASCII;
        // check if no spaces
        if (!input.match(reqs.password.regExNoSpaces)) error |= reqs.error.REGEX_SPACES;

        setPassword(input);
        setErrors({...errors, password: error});
    }
    function onSelectPassword() {
        setErrors({...errors, showPassword: true});
    }
    function onDeselectPassword() {
        setErrors({...errors, showPassword: false});
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // If password is invalid but isn't showing errors to user, will display errors and prevent login. User can press "login" again proceed anyways.
        if (errors.password > 0 && !errors.showPassword && onSelectPassword()) return;

        //Authenticate user (Username: user, Password: pass)
        try {
            const response = await axios.post("http://localhost:5000/authenticate", {username, password});
            console.log(response);
            if (response.status === 200) {
                console.log("User authenticated!");
                login(username);    //Flag AuthProvider that user is logged in and set states
                                    
                //Load user preferences (dark/light mode, fish list, profile pic, etc.)
                try {
                    const response = await axios.post("http://localhost:5000/loadUserInfo", {username});
                    if (response.status === 200) {
                        console.log("User info retrieved!");
                        toggleBrightness(response.data);

                        //Set light for doc body
                        if(brightNess === 0){
                            document.body.classList.add("dark-mode-body");
                        }
                        else{
                            document.body.classList.remove("dark-mode-body");
                        }
                    }
                } catch (error) {
                    console.error("User info retrieval failure:", error.response?.data || error.message);
                    //Display error to user
                }
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
        <div className = "login_container">
            <div className = "login_box" style={styles}>
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
                        onSelect={onSelectPassword}
                        onBlur={onDeselectPassword}
                        onChange={checkPassword}
                        required
                    />
                    <p className="info">*Password must be at least {reqs.password.minLength} characters long.</p>
                    <p className="info">*Password must be at most {reqs.password.maxLength} characters long.</p>
                    <p className="info">*Password must consist only of ASCII characters.</p>
                    <p className="info">*Password must contain no spaces.</p>
                    <br />

                    <button type="submit">Login</button>
                </form>

            </div>
            <Link id={`createaccount-button`} to={`/CreateAccount`}><button className="create">Create Account</button></Link>
        </div>
    );
};