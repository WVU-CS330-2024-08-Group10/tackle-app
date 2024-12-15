/**
 * NavBar.js
 * 
 * This component provides the navigation bar seen at the top of all pages.
 */

import { Link, useNavigate, useLocation } from 'react-router-dom';
import React from 'react';
import { useAuth } from "../components/AuthProvider";

// Configure the 4 buttons at the top of the page.
const pages = ["/", "/Weather", "/Personal", "/About"];
const display = ["Home", "Weather", "Personal", "About"];
const icons = ["home", "sunny", "account_circle", "groups"];

/**
 * NavBar component provides the navigation bar at the top of every page.
 * @returns {JSX.Element} Navigation bar element.
 */
export default function NavBar(){
	const { isLoggedIn, profile, logout, setProfile, setNavBack } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	/**
	 * Puts the user in darkmode if currently in lightmode, and vice versa, 
	 * setting all appropriate values to do so including the class of the document body.
	 */
	function toggleMode() {
		//false = light, true = dark
		if (!profile.darkmode) {
			setProfile({...profile, darkmode: true});
		}
		else {
			setProfile({...profile, darkmode: false});
		}
	}
	
	/**
	 * Logs the user out of their account, and returns them to the homepage.
	 */
	function logoutAccount() {
		logout();
		navigate("/");
	}

    return(
		<header id="navbar-container">
			<Link id={"logo-container"} key={"logo-container"} to={"/"}><img id="logo" src={require('../assets/TackleLogo.jpg')} alt="Tackle logo"/></Link>
			
			{pages.map((page, i) => { 
				return <Link id={`navbutton-${i}`} key={`navbutton-${i}`} className={"navbutton" + (location.pathname === page ? " navbutton-selected" : "")} to={page}><span className="material-icons">{icons[i]}</span>{display[i]}</Link>
			})}

			{isLoggedIn ? (
                <button onClick={logoutAccount} className="btnLogin-popup">Logout</button>
            ) : (
                <Link id={"navbutton-login"} key={"navbutton-login"} to={"/Login"} onClick={() => setNavBack(location.pathname)}><button className="btnLogin-popup">Login</button></Link>
            )}
			
			<div id="toggle-container">
				<header id="toggle-header">Light/Dark</header>
				<button id="toggle-button" onClick={toggleMode}>Toggle</button>
			</div>
		</header>
    );
}