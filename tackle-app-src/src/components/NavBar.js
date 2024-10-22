import { Link } from 'react-router-dom';

export default function NavBar(){
    return(
        <div id="navbutton-grid">
			<Link to="/">Home</Link>
			<Link to="/Information">Information</Link>
			<Link to="/Personal">Personal</Link>
			<Link to="/About">About</Link>
		</div>
    );
}