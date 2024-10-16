//Variables
let $dayDivs = [];   //array containing all days of the week divs
let days = [
   {
      name: "Sunday",
      value: 0
   },
   {
      name: "Monday",
      value: 1
   },
   {
      name: "Tuesday",
      value: 2
   },
   {
      name: "Wednesday",
      value: 3
   },
   {
      name: "Thursday",
      value: 4
   },
   {
      name: "Friday",
      value: 5
   },
   {
      name: "Saturday",
      value: 6
   }
];

//Constructor of some sort (piping NOAA data to variables)
function constructor(){
   let time = 16.0;  //24-hour clock (military time)
   let day = 2;
   let month = 5;
   let temperature = 70.2; //fahrenheit
   let precipitation = "rain";
   let windSpeed = 4.5; //mph
}

//when DOM has loaded
$(function(){
   constructor(); //get updated values

   let $container = $("#container");   //container div from WeatherConditionsHTML

   for(let i = 0; i < days.length; i++){
      let $day = $("<div>"+days[i].name+"</div>");
      $day.addClass("day");
      $day.addClass("information-invisible");
      $day.on("click", function(){ clickDay(i) });
      $day.on("mouseover", function(){ this.style.borderColor = "green"; });
      $day.on("mouseout", function(){ this.style.borderColor = ""; });
      $container.append($day);
      $dayDivs.push($day);
   }
});

function clickDay(index){
   $dayDivs[index].addClass("informationVisible");
}

function getTemp(){
   if(temperature <= 32){
      return {string: "freezing", value: temperature, rating: 0};
   }
   else if(temperature <= 45){
      return {string: "cold", value: temperature, rating: 1};
   }
   else if(temperature <= 55){
      return {string: "cool", value: temperature, rating: 2};
   }
   else if(temperature <= 65){
      return {string: "warm", value: temperature, rating: 3};
   }
   else{
      return {string: "hot", value: temperature, rating: 4};
   }
}

function getPrecipitation(){
   if(precipitation === "clear"){
      return {value: precipitation, rating: 0};
   }
   else if(precipitation === "drizzle"){
      return {value: precipitation, rating: 1};
   }
   else if(precipitation === "rain"){
      return {value: precipitation, rating: 2};
   }
   else if(precipitation === "hail"){
      return {value: precipitation, rating: 3};
   }
   else if(precipitation === "sleet"){
      return {value: precipitation, rating: 3};
   }
   else if(precipitation === "snow"){
      return {value: precipitation, rating: 4};
   }
   else{
      return {value: precipitation, rating: -1};;
   }
}

function getSunlight(){
   if(time >= 7.0 && time <= 19.0){
      return {string: "day", value: time, rating: 1};
   }
   else{
      return {string: "night", value: time, rating: 1};
   }
}

function getWindSpeed(){
   if(windSpeed < 3){
      return {string: "light", value: windSpeed, rating: 0};
   }
   else if(windSpeed <= 5){
      return {string: "moderate", value: windSpeed, rating: 1};
   }
   else{
      return {string: "high", value: windSpeed, rating: 2};
   }
}

function getSeason(){
   if(month === 11 || month === 12 || month === 1){
      return {string: "Winter", value: month, rating: 2};
   }
   else if(month === 2 || month === 3 || month === 4){
      return {string: "Spring", value: month, rating: 0};
   }
   else if(month === 5 || month === 6 || month === 7){
      return {string: "Summer", value: month, rating: 1};
   }
   else if(month === 8 || month === 9 || month === 10){
      return {string: "Autumn", value: month, rating: 0};
   }
   else{
      return "Invalid month given.";
   }
}