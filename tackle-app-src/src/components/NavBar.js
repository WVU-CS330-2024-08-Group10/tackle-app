import { Link } from 'react-router-dom';
import React, { useState } from 'react';

// perhaps it would be better to an array of 4 objects with this info in them? 
const pages = ["", "Weather", "Personal", "About"];
const display = ["Home", "Weather", "Personal", "About"];
const icons = ["home", "sunny", "account_circle", "groups"];

const classesDefault = Array(pages.length).fill("navbutton");

export default function NavBar(){
	let url = window.location.href.split("/");
	let page = url[url.length - 1];
	let selected = pages.indexOf(page);

	let classesInit = [...classesDefault]; // makes a copy of classesDefault
	classesInit[selected] += " navbutton-selected";
	const [classes, setClasses] = useState(classesInit);

	function color(num) {
		if (selected !== num) {
			selected = num;

			let classesInit = [...classesDefault];
			classesInit[num] += " navbutton-selected";
			setClasses(classesInit);
		}
	}

	function toggleMode() {
		var element = document.body;
   		element.classList.toggle("dark-mode");
	}

    return(
		<header id="navbar-container">
			<Link id={`logo-container`} key={`logo-container`} to={`/`} onClick={() => color(0)}><img id="logo" src={require('../assets/TackleLogo.jpg')} alt="Tackle logo"/></Link>
			
			{pages.map((page, i) => { 
				return <Link id={`navbutton-${i}`} key={`navbutton-${i}`} className={classes[i]} to={`/${page}`} onClick={() => color(i)}><span className="material-icons">{icons[i]}</span>{display[i]}</Link>
			})}

			<Link id={`navbutton-login`} key={`navbutton-login`} to={`/Login`} onClick={() => color(-1)}><button className="btnLogin-popup">Login</button></Link>
			
			<div id="toggle-container">
				<header id="toggle-header">Light/Dark</header>
				<button id="toggle-button" onClick={toggleMode}>Toggle</button>
			</div>
		</header>
    );
}