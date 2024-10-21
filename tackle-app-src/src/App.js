import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import PageNotFound from "./pages/PageNotFound";
import NavBar from "./components/NavBar";

function App() {
  return (
	<>
		<div>
		  <BrowserRouter>
			<NavBar />
			<Routes>
			  <Route path="/" element={<Home />} />
			  <Route path="/About" element={<About />} />
			  <Route path="*" element={<PageNotFound />} />
			</Routes>
		  </BrowserRouter>
		</div>
	</>
  );
}

export default App;
