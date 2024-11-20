import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from 'react-router-dom';
import { passwordReqs } from "../components/AccountReqs";

const errorsInit = {
    password: 0,
    showPassword: false
}

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({...errorsInit});
    const navigate = useNavigate();

    const checkPassword = (e) => {
        let error = 0;
        let input = e.target.value;

        // check if meets minimum length
        if (input.length < passwordReqs.minLength) error |= 1;
        // check if meets maximum length
        if (input.length > passwordReqs.maxLength) error |= 2;
        // check if only ASCII
        if (!passwordReqs.regExOnlyASCII.test(input)) error |= 4;
        // check if no spaces
        if (!passwordReqs.regExNoSpaces.test(input)) error |= 8;

        setPassword(input);
        setErrors({...errors, password: error});
    }
    function onDeselectPassword() {
        if (errors.password > 0) {
            setErrors({...errors, showPassword: true});
            return true;
        } else {
            setErrors({...errors, showPassword: false});
            return false;
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // If password is invalid but isn't showing errors to user, will display errors and prevent login. User can press "login" again proceed anyways.
        if (!errors.showPassword && onDeselectPassword()) return;

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
        <div className = "login_container">
            <div className = "login_box">
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
                        onBlur={onDeselectPassword}
                        onChange={checkPassword}
                        required
                    />
                    {errors.showPassword && <>
                        {(errors.password & 1) !== 0 && <p className="error">*Password must be at least {passwordReqs.minLength} characters long.</p>}
                        {(errors.password & 2) !== 0 && <p className="error">*Password must be at most {passwordReqs.maxLength} characters long.</p>}
                        {(errors.password & 4) !== 0 && <p className="error">*Password must consist only of ASCII characters.</p>}
                        {(errors.password & 8) !== 0 && <p className="error">*Password must contain no spaces.</p>}
                    </>}
                    <br />
                
                    <button type="submit">Login</button>
                </form>

            </div>
            <Link id={`createaccount-button`} key={`createaccount-button`} to={`/CreateAccount`}><button>Create Account</button></Link>
        </div>
    );
};