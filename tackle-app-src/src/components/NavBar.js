import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from "../components/AuthProvider";
import axios from "axios";

// perhaps it would be better to an array of 4 objects with this info in them? 
const pages = ["", "Weather", "Personal", "About"];
const display = ["Home", "Weather", "Personal", "About"];
const icons = ["home", "sunny", "account_circle", "groups"];

const classesDefault = Array(pages.length).fill("navbutton");

export default function NavBar(){
	const { userName, isLoggedIn, logout, brightNess, toggleBrightness} = useAuth();
	const navigate = useNavigate();
	let url = window.location.href.split("/");
	let page = url[url.length - 1];
	let selected = pages.indexOf(page);

	let classesInit = [...classesDefault]; // makes a copy of classesDefault
	classesInit[selected] += " navbutton-selected";
	const [classes, setClasses] = useState(classesInit);

	async function toggleMode() {
		//0 = light, 1 = dark
		var element = document.body;
		if(brightNess === 0){
			if(userName !== null){
				await sendBrightness(1);
				toggleBrightness(1);
				element.classList.add("dark-mode-body");
			}
		}
		else{
			if(userName !== null){
				await sendBrightness(0);
				toggleBrightness(0);
				element.classList.remove("dark-mode-body");
			}
		}
	}

	async function sendBrightness(newBrightness){
		//Updating user preference (light/dark mode)
		try {
			let username = userName;
			let brightness = newBrightness;
			const response = await axios.post("http://localhost:5000/insertBrightness", {username, brightness});
			if (response.status === 200) {
				console.log("Brightness sent!");
			}
		} catch (error) {
			console.error("Brightness info failure:", error.response?.data || error.message);
			//Display error to user
		}
	}

	function color(num){
		if (selected !== num) {
			selected = num;
	
			let classesInit = [...classesDefault];
			classesInit[num] += " navbutton-selected";
			setClasses(classesInit);
		}
	}
	
	function logoutAccount() {
		logout();
		navigate("/");
		color(0);
	}

    return(
		<header id="navbar-container">
			<Link id={`logo-container`} key={`logo-container`} to={`/`} onClick={() => color(0)}><img id="logo" src={require('../assets/TackleLogo.jpg')} alt="Tackle logo"/></Link>
			
			{pages.map((page, i) => { 
				return <Link id={`navbutton-${i}`} key={`navbutton-${i}`} className={classes[i]} to={`/${page}`} onClick={() => color(i)}><span className="material-icons">{icons[i]}</span>{display[i]}</Link>
			})}

			{isLoggedIn ? (
                <button onClick={() => logoutAccount()} className="btnLogin-popup">Logout</button>
            ) : (
                <Link id={`navbutton-login`} key={`navbutton-login`} to={`/Login`} onClick={() => color(-1)}><button className="btnLogin-popup">Login</button></Link>
            )}
			
			<div id="toggle-container">
				<header id="toggle-header">Light/Dark</header>
				<button id="toggle-button" onClick={toggleMode}>Toggle</button>
			</div>
		</header>
    );
}