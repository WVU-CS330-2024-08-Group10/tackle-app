import { Link } from 'react-router-dom';

export default function NavBar(){
    return(
        <div id="navbutton-grid">
		<Link to="/"><span class="material-icons">home</span>Home</Link>
			<Link to="/Information"><span class="material-icons">info</span>Information</Link>
			<Link to="/Personal"><span class="material-icons">account_circle</span>Personal</Link>
			<Link to="/About"><span class="material-icons">groups</span>About</Link>
		</div>
    );
}