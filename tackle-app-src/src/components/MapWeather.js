import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

//Variables
const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const apiKey = process.env.REACT_APP_APIKEY;
const zip = `26508`; 
const url = `https://api.openweathermap.org/data/2.5/forecast?zip=${zip}&units=imperial&appid=${apiKey}`;
const classesDefault = Array(days.length).fill("daybutton");

function MapWeather() {
    const [classes, setClasses] = useState(classesDefault);
    const [weatherData, setWeatherData] = useState([]);
    const [selectedDay, setSelectedDay] = useState(-1); 
    const [selectedWeather, setSelectedWeather] = useState(null);
    const [selectedDayName, setSelectedDayName] = useState("");

        // Getting the data from the API
        useEffect(() => {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const dailyWeather = data.list.slice(0, 9).map((forecast, index) => ({
                        temp: `${Math.round(forecast.main.temp)}°F`,
                        feels_like: `${forecast.main.feels_like}°F`,
                        windspeed: `${forecast.wind.speed} mph`,
                        sunrise: new Date(data.city.sunrise * 1000).toLocaleTimeString(),
                        sunset: new Date(data.city.sunset * 1000).toLocaleTimeString(),
                        humidity: `${forecast.main.humidity}%`,
                    }));
                    setWeatherData(dailyWeather);
                })
                .catch(error => console.error('Error fetching weather data:', error));
        }, [url]);


    function click(index) {
        if (selectedDay !== index) {
            setSelectedDay(index);
            setSelectedDayName(days[index]);
            setSelectedWeather(weatherData[index]);

            // color switching stuff
            let classesInit = [...classesDefault]; // makes a copy of classesDefault
            classesInit[index] += " daybutton-selected";
            setClasses(classesInit);
        } 
    }

    //Prepares the weather information to be rendered in the box when clicking days 
    const weatherContent = selectedWeather && ( 
        <div id="weather">
            <h2>Weather Information for {selectedDayName}</h2>
            <p>Temperature: {selectedWeather.temp}</p>
            <p>Feels like: {selectedWeather.feels_like}</p>
            <p>Windspeed: {selectedWeather.windspeed}</p>
            <p>Sunrise: {selectedWeather.sunrise}</p>
            <p>Sunset: {selectedWeather.sunset}</p>
            <p>Humidity: {selectedWeather.humidity}</p>
        </div>
    );

    const weatherBox = document.getElementById("weatherBox");

    //the code below the days-container renders the React component in the weather box on the map page ONLY if the weather box exists
    //at the time that it is ready to be rendered. 
    return (

        <div>
            <div id="days-container">
                {days.map((day, index) => ( <div id={`day-${index}`} onClick={() => click(index)} className={classes[index]} key={index}>{day}</div>))}
            </div>
            {weatherBox ? ReactDOM.createPortal(weatherContent, weatherBox) : weatherContent}
        </div>
    );
}
export default MapWeather;