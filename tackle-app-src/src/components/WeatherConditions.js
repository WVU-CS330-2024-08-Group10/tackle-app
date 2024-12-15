import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useAuth } from "./AuthProvider";

const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const zip = "26508"; 

function WeatherConditions(args) {
    const isForHomePage = typeof args.isForHomePage !== 'undefined';

    const { borderStyle, getWeatherData } = useAuth();

    const [weatherData, setWeatherData] = useState([]);
    const [selectedDay, setSelectedDay] = useState(-1); 
    const [selectedWeather, setSelectedWeather] = useState(null);

    // Getting the data from the API
    useEffect(() => {
        getWeatherData(zip).then((response) => {
            const data = response.data;
            const dailyWeather = data.list.slice(0, 9).map((forecast, index) => ({
                temp: `${Math.round(forecast.main.temp)}°F`,
                feels_like: `${forecast.main.feels_like}°F`,
                windspeed: `${forecast.wind.speed} mph`,
                sunrise: new Date(data.city.sunrise * 1000).toLocaleTimeString(),
                sunset: new Date(data.city.sunset * 1000).toLocaleTimeString(),
                humidity: `${forecast.main.humidity}%`,
            }));
            setWeatherData(dailyWeather);
        }).catch(error => console.error('Error fetching weather data:', error));
    }, [getWeatherData]);


    function click(index) {
        if (selectedDay !== index) {
            setSelectedDay(index);
            setSelectedWeather(weatherData[index]);
        } else {
            closePopup();
        }
    }

    function closePopup() {
        setSelectedDay(-1);
        setSelectedWeather(undefined);
    }

    //Prepares the weather information to be rendered in the box when clicking days 
    const weatherContent = selectedWeather && ( 
        <div id="weather">
            <h2>Weather Information for {days[selectedDay]}</h2>
            <p>Temperature: {selectedWeather.temp}</p>
            <p>Feels like: {selectedWeather.feels_like}</p>
            <p>Windspeed: {selectedWeather.windspeed}</p>
            <p>Sunrise: {selectedWeather.sunrise}</p>
            <p>Sunset: {selectedWeather.sunset}</p>
            <p>Humidity: {selectedWeather.humidity}</p>
        </div>
    );

    const weatherBox = document.getElementById("weatherBox");

    return (

        <div>
            <div id="days-container" style={borderStyle}>
                {days.map((day, index) => ( <div id={`day-${index}`} onClick={() => click(index)} className={"daybutton" + (selectedDay === index ? " daybutton-selected" : "")} key={index}>{day}</div>))}
            </div>

            {!isForHomePage ? 
                <>{ // What is rendered on "weather" page
                    selectedWeather && (
                        <div style={borderStyle} id="popup">
                            <h2>Weather Information for {days[selectedDay]}</h2>
                            <p>Temperature: {selectedWeather?.temp}</p>
                            <p>Feels like: {selectedWeather?.feels_like}</p>
                            <p>Windspeed: {selectedWeather?.windspeed}</p>
                            <p>Sunrise: {selectedWeather?.sunrise}</p>
                            <p>Sunset: {selectedWeather?.sunset}</p>
                            <p>Humidity:  {selectedWeather?.humidity}</p>
                            <button id="popup-exit" onClick={closePopup}>Close</button >
                        </div>
                )}</> : <>{ // What is rendered on "map" page
                    // the code below the days-container renders the React component in the weather box on the map page ONLY if the weather box exists
                    // at the time that it is ready to be rendered. 
                    weatherBox ? ReactDOM.createPortal(weatherContent, weatherBox) : weatherContent
                }</>
            }
        </div>
    );
}
export default WeatherConditions;