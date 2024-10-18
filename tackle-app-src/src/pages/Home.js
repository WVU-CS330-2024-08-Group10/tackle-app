import FishingConditions from "../components/FishingConditions";
import Map from "../components/Map";
import WeatherConditions from "../components/WeatherConditions";

export default function Home(){
    return(
        <>
            <h1>Home Page</h1>
            <WeatherConditions />
            <Map />
            <FishingConditions />
        </>
    );
}