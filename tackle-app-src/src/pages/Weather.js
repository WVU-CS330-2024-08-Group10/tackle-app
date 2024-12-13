/**
 * Weather.js
 * 
 * This component provides the weather page.
 */

import WeatherConditions from "../components/WeatherConditions";

/**
 * Weather page element.
 * 
 * Note: Weather dropdown shown on this page is a seperate component,
 * contained within WeatherConditions.js.
 * @returns {JSX.Element} Weather page element.
 */
export default function Weather(){
    return(
        <>
            <h1 className="page-header">It's Feeling.... fishy</h1>
            <WeatherConditions />
        </>
    );
}