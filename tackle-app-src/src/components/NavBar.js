import { Link } from 'react-router-dom';
import React, { useState } from 'react';

// perhaps it would be better to an array of 4 objects with this info in them? 
const pages = ["", "Information", "Personal", "About"];
const display = ["Home", "Information", "Personal", "About"];
const icons = ["home", "info", "account_circle", "groups"];

const classesDefault = Array(pages.length).fill("navbutton");

export default function NavBar(){
	let url = window.location.href.split("/");
	let page = url[url.length - 1];
	let selected = pages.indexOf(page);
	if (selected === -1) selected = 0;

	let classesInit = [...classesDefault]; // makes a copy of classesDefault
	classesInit[selected] += " navbutton-selected";
	const [classes, setClasses] = useState(classesInit);

	function color(num) {
		if (selected !== num) {
			selected = num;

			let classesInit = [...classesDefault];
			classesInit[num] += " navbutton-selected";
			setClasses(classesInit);
	
			// temporary map fix stuff
			if (num === 0) {
				let url = window.location.href;
				url = url.substring(0, url.lastIndexOf("/"));
				window.location.reload();
				window.location.href = url;
			}
		}
	}

    return(
        <div id="navbutton-grid">
			{pages.map((page, i) => { 
				return <Link id={`navbutton-${i}`} key={`navbutton-${i}`} className={classes[i]} to={`/${page}`} onClick={() => color(i)}><span className="material-icons">{icons[i]}</span>{display[i]}</Link>
			})}
		</div>
    );
}