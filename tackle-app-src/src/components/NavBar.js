import { Link, useNavigate, useLocation } from 'react-router-dom';
import React from 'react';
import { useAuth } from "../components/AuthProvider";

// perhaps it would be better to an array of 4 objects with this info in them? 
const pages = ["/", "/Weather", "/Personal", "/About"];
const display = ["Home", "Weather", "Personal", "About"];
const icons = ["home", "sunny", "account_circle", "groups"];

export default function NavBar(){
	const { isLoggedIn, profile, logout, setProfile, setNavBack } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	function toggleMode() {
		//false = light, true = dark
		var element = document.body;
		if (!profile.darkmode) {
			setProfile({...profile, darkmode: true});
			element.classList.add("dark-mode-body");
		}
		else {
			setProfile({...profile, darkmode: false});
			element.classList.remove("dark-mode-body");
		}
	}
	
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