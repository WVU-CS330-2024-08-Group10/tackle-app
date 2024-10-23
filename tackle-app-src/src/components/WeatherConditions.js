import React, { useState } from 'react';

//Variables
let $dayDivs = [];   //array containing all days of the week divs
const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const weatherData = [
    { windspeed: '10 mph', temp: '20°F', sunrise: '6:00 AM', sunset: '6:30 PM',  humidity: '50%' },
    { windspeed: '12 mph', temp: '22°F', sunrise: '6:01 AM', sunset: '6:31 PM', humidity:  '55%' },
    { windspeed: '8 mph', temp: '19°F', sunrise: '6:02 AM', sunset: '6:32 PM',  humidity: '60%' },
    { windspeed: '15 mph', temp: '21°F', sunrise: '6:03 AM', sunset: '6:33 PM', humidity:'65%' },
    { windspeed: '9 mph', temp: '23°F', sunrise: '6:04 AM', sunset: '6:34 PM',   humidity: '70%' },
    { windspeed: '11 mph', temp: '18°F', sunrise: '6:05 AM', sunset: '6:35 PM',   humidity: '75%' },
    { windspeed: '14 mph', temp: '24°F', sunrise: '6:06 AM', sunset: '6:36 PM',   humidity: '80%' },
];

function WeatherConditions() {
    const [popupVisible, setPopupVisible] = useState(false);
    const [selectedWeather, setSelectedWeather] = useState({});
    const [buttonColor, setButtonColor] = useState('');

    function click(index) {
        console.log(days[index] + " clicked");
        setSelectedWeather(weatherData[index]);
        setPopupVisible(true);
        setButtonColor('red');
    }

    function closePopup() {
        setPopupVisible(false);
        setButtonColor('');
    }

    return (
        <div>
            <div id="daysContainer">
                {days.map((day, index) => ( <div id="day" onClick={() => click(index)} key={index}>{day}</div>))}
            </div>

            {popupVisible && (
                <div id="popup">
                    <h2>Weather Information</h2>
                    <p>Temperature: {selectedWeather.temp}</p>
                    <p>Windspeed: {selectedWeather.windspeed}</p>
                    <p>Sunrise: {selectedWeather.sunrise}</p>
                    <p>Sunset: {selectedWeather.sunset}</p>
                    <p>Humidity:  {selectedWeather.humidity}</p>
                    <button style={{ backgroundColor: buttonColor}} onClick={closePopup}>Close</button >
                </div>
            )}
        </div>
    );
}
export default WeatherConditions;