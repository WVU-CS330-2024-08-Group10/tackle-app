import { Link } from 'react-router-dom';

const pages = ["Home", "Information", "Personal", "About"];

export default function NavBar(){
	let url = window.location.href.split("/");
	let page = url[url.length - 1];
	let selected = pages.indexOf(page);
	if (selected == -1) selected = 0;

    return(
        <div id="navbutton-grid">
			{pages.map((page, i) => { 
				if (i == 0) return (<NavButton num={i} selected={selected} linkTo="" display={page} key={page} />);
				return (<NavButton num={i} selected={selected} linkTo={page} display={page} key={page} />);
			})}
		</div>
    );
}

function NavButton(props) {
	function color(num) {
		//initializes a variable for storing the url of the clicked nav option
		let url;
		var navButtons = document.getElementById("navbutton-grid").children;
		for (let item of navButtons) item.className = "navbutton";
			navButtons[num].classList.add("navbutton-selected");
			//sets the url variable to the clicked nav button
			url = navButtons[num].href;
		
		if(url == "http://localhost:3000/") {
			//refreshes the page to trigger a map reload 
			window.location.reload();
			//updates the url location so that the reload does not result in aways going home
			window.location.href = url;
		}
	}

	let num = parseInt(props.num);
	let selected = parseInt(props.selected)
	let linkTo = props.linkTo;
	let display = props.display;

	return <Link id={`navbutton-${num}`} className={"navbutton" + (selected == num ? " navbutton-selected" : "")} to={`/${linkTo}`} onClick={() => color(num)}>{display}</Link>
}