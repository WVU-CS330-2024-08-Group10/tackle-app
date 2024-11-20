import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {usernameReqs, passwordReqs} from "../components/AccountReqs";

const profileErrorInit = {
    username: 0,
    password: 0,
    passwordConfirm: 0
}

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [profileError, setProfileError] = useState({...profileErrorInit});
    const navigate = useNavigate();

    function checkUsername(usernameTest) {
        let error = 0;

        // check if meets minimum length
        if (usernameTest.length < usernameReqs.minLength) error |= 1;
        // check if meets maximum length
        if (usernameTest.length > usernameReqs.maxLength) error |= 2;
        // check if is alphanumeric, underscore, or dash
        if (!usernameReqs.regEx.test(usernameTest)) error |= 4;

        setUsername(usernameTest);
        setProfileError({...profileError, username: error});
    }

    function checkPassword(passwordTest) {
        let error = 0;

        // check if meets minimum length
        if (passwordTest.length < passwordReqs.minLength) error |= 1;
        // check if meets maximum length
        if (passwordTest.length > passwordReqs.maxLength) error |= 2;
        // check if only ASCII
        if (!passwordReqs.regExOnlyASCII.test(passwordTest)) error |= 4;
        // check if no spaces
        if (!passwordReqs.regExNoSpaces.test(passwordTest)) error |= 8;

        setPassword(passwordTest);
        setProfileError({...profileError, password: error});
    }

    function checkPasswordConfirm(passwordTest) {
        let error = 0;

        // check if matches password
        if (passwordTest != password) error |= 1;

        setPasswordConfirm(passwordTest);
        setProfileError({...profileError, passwordConfirm: error});
    }   

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        checkUsername(username);
        checkPassword(password);
        checkPasswordConfirm(passwordConfirm);

        if (profileError.username > 0) {
            console.error("Invalid username!");
            return;
        } else if (profileError.password > 0) {
            console.error("Invalid password!");
            return;
        } else if (profileError.passwordConfirm > 0) {
            console.error("Passwords don't match!");
            return;
        }

        //Create account for user
        try {
            const response = await axios.post("http://localhost:5000/api/insert", {username, password});
            if (response.status === 200) {
                console.log("Account created!");
                //remove Login button from navbar
                navigate("/");
            }
            else if(response.status === 401){
                console.error("Account creation failed: Username already exists");
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
                onChange={(e) => checkUsername(e.target.value)}
                required
            />
            {(profileError.username & 1) !== 0 && <p className="error">*Username must be at least {usernameReqs.minLength} characters long.</p>}
            {(profileError.username & 2) !== 0 && <p className="error">*Username must be at most {usernameReqs.maxLength} characters long.</p>}
            {(profileError.username & 4) !== 0 && <p className="error">*Username must consist of letters, numbers, dashes, or underscores.</p>}
            <br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => checkPassword(e.target.value)}
                required
            />
            {(profileError.password & 1) !== 0 && <p className="error">*Password must be at least {passwordReqs.minLength} characters long.</p>}
            {(profileError.password & 2) !== 0 && <p className="error">*Password must be at most {passwordReqs.maxLength} characters long.</p>}
            {(profileError.password & 4) !== 0 && <p className="error">*Password must consist only of ASCII characters.</p>}
            {(profileError.password & 8) !== 0 && <p className="error">*Username must contain no spaces.</p>}
            <br />

            <input
                type="password"
                placeholder="Confirm Password"
                value={passwordConfirm}
                onChange={(e) => checkPasswordConfirm(e.target.value)}
                required
            />
            {(profileError.passwordConfirm & 1) !== 0 && <p className="error">*Passwords must match.</p>}
            <br />

            <button type="submit">Create Account</button>
            </form>
        </div>
    );
};