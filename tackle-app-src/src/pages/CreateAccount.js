import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import reqs from "../components/AccountReqs.json";

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
        if (input.length < reqs.username.minLength) error |= 1;
        // check if meets maximum length
        if (input.length > reqs.username.maxLength) error |= 2;
        // check if is alphanumeric, underscore, or dash
        if (!input.match(reqs.username.regEx)) error |= 4;

        setUsername(input);
        setErrors({...errors, username: error});
    }

    const checkPassword = (e) => {
        let error = 0;
        let errorConfirm = 0;
        let input = e.target.value;

        // check if meets minimum length
        if (input.length < reqs.password.minLength) error |= 1;
        // check if meets maximum length
        if (input.length > reqs.password.maxLength) error |= 2;
        // check if only ASCII
        if (!input.match(reqs.password.regExOnlyASCII)) error |= 4;
        // check if no spaces
        if (!input.match(reqs.password.regExNoSpaces)) error |= 8;
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
            const response = await axios.post("http://localhost:5000/api/insertUser", {username, password});
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
        <div className = "login_container">
            <div className = "login_box">
                <h2>Create Account</h2>
                <form onSubmit = {handleSubmit}>
                    <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={checkUsername}
                    required
                />
                {(errors.username & 1) !== 0 && <p className="error">*Username must be at least {reqs.username.minLength} characters long.</p>}
                {(errors.username & 2) !== 0 && <p className="error">*Username must be at most {reqs.username.maxLength} characters long.</p>}
                {(errors.username & 4) !== 0 && <p className="error">*Username must consist of letters, numbers, dashes, or underscores.</p>}
                <br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={checkPassword}
                    required
                />
                {(errors.password & 1) !== 0 && <p className="error">*Password must be at least {reqs.password.minLength} characters long.</p>}
                {(errors.password & 2) !== 0 && <p className="error">*Password must be at most {reqs.password.maxLength} characters long.</p>}
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
        </div>
    );
};