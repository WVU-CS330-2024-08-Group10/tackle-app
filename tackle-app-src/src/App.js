import {BrowserRouter, Routes, Route} from "react-router-dom";
import ReactModal from 'react-modal';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Weather from "./pages/Weather";
import Personal from "./pages/Personal";
import About from "./pages/About";
import NavBar from "./components/NavBar";
import PageNotFound from "./pages/PageNotFound";
import CreateAccount from "./pages/CreateAccount";
import DeleteAccount from "./pages/DeleteAccount";

function App() {
	ReactModal.setAppElement("#root");
  	return (
		<>
			<BrowserRouter>
				<NavBar />
				<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/Login" element={<Login />} />
				<Route path="/CreateAccount" element={<CreateAccount />} />
				<Route path="/DeleteAccount" element={<DeleteAccount />} />
				<Route path="/Weather" element={<Weather />} />
				<Route path="/Personal" element={<Personal />} />
				<Route path="/About" element={<About />} />
				<Route path="*" element={<PageNotFound />} />
				</Routes>
			</BrowserRouter>
		</>
  	);
}

export default App;
