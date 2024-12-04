import React, { useState, useEffect } from 'react';

//Variables
const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const apiKey = process.env.REACT_APP_APIKEY;
const zip = `26508`; // Im thinking that at one point it can be made to  be a user input
const url = `https://api.openweathermap.org/data/2.5/forecast?zip=${zip}&units=imperial&appid=${apiKey}`;
const classesDefault = Array(days.length).fill("daybutton");

function WeatherConditions() {
    const [popupVisible, setPopupVisible] = useState(false);
    const [selectedWeather, setSelectedWeather] = useState({});
    const [classes, setClasses] = useState(classesDefault);
    const [weatherData, setWeatherData] = useState([]);
    // i don't know why, but this has to use states. basically the same thing in NavBar can just use a normal variable...whatever
    const [selectedDay, setSelectedDay] = useState(-1); 


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

            console.log(days[index] + " clicked");
            setSelectedWeather(weatherData[index]);
            setPopupVisible(true);
    
            // color switching stuff
            let classesInit = [...classesDefault]; // makes a copy of classesDefault
            classesInit[index] += " daybutton-selected";
            setClasses(classesInit);
        } else {
            closePopup();
        }
    }

    function closePopup() {
        setSelectedDay(-1);
        setPopupVisible(false);

        // color switching stuff
        setClasses(classesDefault);
    }

    return (

        <div>
            <div id="days-container">
                {days.map((day, index) => ( <div id={`day-${index}`} onClick={() => click(index)} className={classes[index]} key={index}>{day}</div>))}
            </div>
    
            {popupVisible &&  selectedWeather &&(
                <div id="popup">
                    <h2>Weather Information for {days[selectedDay]}</h2>
                    <p>Temperature: {selectedWeather?.temp}</p>
                    <p>Feels like: {selectedWeather?.feels_like}</p>
                    <p>Windspeed: {selectedWeather?.windspeed}</p>
                    <p>Sunrise: {selectedWeather?.sunrise}</p>
                    <p>Sunset: {selectedWeather?.sunset}</p>
                    <p>Humidity:  {selectedWeather?.humidity}</p>
                    <button id="popup-exit" onClick={closePopup}>Close</button >
                </div>
            )}
        </div>
    );
}
export default WeatherConditions;
