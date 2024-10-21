//Variables
let $dayDivs = [];   //array containing all days of the week divs
const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function click(){
    console.log("clicked");
}

function WeatherConditions(){
    return(
        <div>
            {days.map((day, index) => ( <li onClick={click} key={index}>{day}</li>))}
        </div>
    );
}

export default WeatherConditions