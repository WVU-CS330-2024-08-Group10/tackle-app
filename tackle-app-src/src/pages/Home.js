import Map from "../components/Map";
import MapWeather from "../components/MapWeather.js";

export default function Home(){
    return(
        <>
            <h1 className="page-header"></h1>
            <Map /> 
            <MapWeather />
        </>
    );
}