/**
 * Home.js
 * 
 * This component provides the home page.
 */

import Map from "../components/Map";
import MapWeather from "../components/MapWeather.js";

/**
 * Home page element.
 * 
 * Note: both the map at the center of the page and the weather dropdown
 * are seperate elements, contained in Map.js and MapWeather.js respectively.
 * @returns {JSX.Element} Home page element.
 */
export default function Home(){
    return(
        <>
            <h1 className="page-header"></h1>
            <Map /> 
            <MapWeather />
        </>
    );
}