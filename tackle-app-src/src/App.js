import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Information from "./pages/Information";
import Personal from "./pages/Personal";
import About from "./pages/About";
import NavBar from "./components/NavBar";
import PageNotFound from "./pages/PageNotFound";

function App() {
  return (
	<>
		<div>
		  <BrowserRouter>
			<NavBar />
			<Routes>
			  <Route path="/" element={<Home />} />
			  <Route path="/Information" element={<Information />} />
			  <Route path="/Personal" element={<Personal />} />
			  <Route path="/About" element={<About />} />
			  <Route path="*" element={<PageNotFound />} />
			</Routes>
		  </BrowserRouter>
		</div>
	</>
  );
}

export default App;
