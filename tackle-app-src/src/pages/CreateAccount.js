import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { usernameReqs, passwordReqs } from "../components/AccountReqs";

const errorsInit = {
    username: 0,
    password: 0,
    passwordConfirm: 0,
    showPasswordConfirm: false
}

export default function CreateAccount() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [errors, setErrors] = useState({...errorsInit});
    const navigate = useNavigate();

    const checkUsername = (e) => {
        let error = 0;
        let input = e.target.value;

        // check if meets minimum length
        if (input.length < usernameReqs.minLength) error |= 1;
        // check if meets maximum length
        if (input.length > usernameReqs.maxLength) error |= 2;
        // check if is alphanumeric, underscore, or dash
        if (!usernameReqs.regEx.test(input)) error |= 4;

        setUsername(input);
        setErrors({...errors, username: error});
    }

    const checkPassword = (e) => {
        let error = 0;
        let errorConfirm = 0;
        let input = e.target.value;

        // check if meets minimum length
        if (input.length < passwordReqs.minLength) error |= 1;
        // check if meets maximum length
        if (input.length > passwordReqs.maxLength) error |= 2;
        // check if only ASCII
        if (!passwordReqs.regExOnlyASCII.test(input)) error |= 4;
        // check if no spaces
        if (!passwordReqs.regExNoSpaces.test(input)) error |= 8;
        // check if matches confirm password
        if (input !== passwordConfirm) errorConfirm |= 1;

        setPassword(input);
        setErrors({...errors, password: error, passwordConfirm: errorConfirm});
    }

    const checkPasswordConfirm = (e) => {
        let error = 0;
        let input = e.target.value;

        // check if matches password
        if (input !== password) error |= 1;

        setPasswordConfirm(input);
        setErrors({...errors, passwordConfirm: error, showPasswordConfirm: true});
    }   

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (errors.username > 0) {
            console.error("Invalid username!");
            return;
        } else if (errors.password > 0) {
            console.error("Invalid password!");
            return;
        } else if (errors.passwordConfirm > 0) {
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
                onChange={checkUsername}
                required
            />
            {(errors.username & 1) !== 0 && <p className="error">*Username must be at least {usernameReqs.minLength} characters long.</p>}
            {(errors.username & 2) !== 0 && <p className="error">*Username must be at most {usernameReqs.maxLength} characters long.</p>}
            {(errors.username & 4) !== 0 && <p className="error">*Username must consist of letters, numbers, dashes, or underscores.</p>}
            <br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={checkPassword}
                required
            />
            {(errors.password & 1) !== 0 && <p className="error">*Password must be at least {passwordReqs.minLength} characters long.</p>}
            {(errors.password & 2) !== 0 && <p className="error">*Password must be at most {passwordReqs.maxLength} characters long.</p>}
            {(errors.password & 4) !== 0 && <p className="error">*Password must consist only of ASCII characters.</p>}
            {(errors.password & 8) !== 0 && <p className="error">*Password must contain no spaces.</p>}
            <br />

            <input
                type="password"
                placeholder="Confirm Password"
                value={passwordConfirm}
                onChange={checkPasswordConfirm}
                required
            />
            {errors.showPasswordConfirm && (errors.passwordConfirm & 1) !== 0 && <p className="error">*Passwords must match.</p>}
            <br />

            <button type="submit">Create Account</button>
            </form>
        </div>
    );
};