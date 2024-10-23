//Variables
let $dayDivs = [];   //array containing all days of the week divs
const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function click(index){
    console.log(days[index] + " clicked");
}

function WeatherConditions(){
    return(
        <div id="daysContainer">
            {days.map((day, index) => ( <div id="day" onClick={() => click(index)} key={index}>{day}</div>))}
        </div>
    );
}

export default WeatherConditions