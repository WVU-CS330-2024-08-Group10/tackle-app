import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Weather from "./pages/Weather";
import Personal from "./pages/Personal";
import About from "./pages/About";
import NavBar from "./components/NavBar";
import PageNotFound from "./pages/PageNotFound";

// Not sure if this is correct
import Login from "./pages/Login"; 

function App() {
  return (
	<>
		<div>
		  <BrowserRouter>
			<NavBar />
			<Routes>
			  <Route path="/" element={<Home />} />
			  <Route path="/Weather" element={<Weather />} />
			  <Route path="/Personal" element={<Personal />} />
			  <Route path="/About" element={<About />} />
			  <Route path="*" element={<PageNotFound />} />

			  
			  <Route path="/Login" element={<Login />}/>

			</Routes>
		  </BrowserRouter>
		</div>
	</>
  );
}

export default App;
