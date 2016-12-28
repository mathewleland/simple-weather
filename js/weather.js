var city = "New York";
var region;
var zip;
var temp;
var APIKey = "0075fd713ebec9d66d1f575ed328ca70"; //for openweathermap data
var celsius = false;
var umbrellaHTML = '<img src="https://s3-us-west-1.amazonaws.com/personalprojectfiles/umbrella.svg" alt="umbrella needed!"/> <p>Make sure to bring one of these!</p>'
var wellBack = document.getElementById("mainWell");
var wellText = document.getElementById("weatherText");

//update all the html with current weather data from our weather object
function update(weather) {
  document.getElementById("location").innerHTML = weather.city;
  document.getElementById("temp").innerHTML = Math.round(kelvinsToF(weather.temp)) + "&#8457;";
  // document.getElementById("icon").src = "img/weather/" + weather.icon + ".svg";
  document.getElementById("icon").src = "https://s3-us-west-1.amazonaws.com/personalprojectfiles/" + weather.icon + ".svg";
  document.getElementById("weatherDesc").innerHTML = weather.desc;
  if (weather.icon.slice(0,2) > 5) {
    document.getElementById("umbrella").innerHTML = umbrellaHTML;
    document.getElementById("umbrella").style.padding = "20px 0 0 0";
    document.getElementById("umbrella").style.maxWidth = "600px";
    }
  else { //delete any umbrella html
    document.getElementById("umbrella").innerHTML = '';
    document.getElementById("umbrella").style.padding = "0";
    document.getElementById("umbrella").style.maxWidth = "0";

  }

  switch(weather.icon) {

    case "01d": //clear sky
      wellBack.style.background = "#7EC0EE";
      wellText.style.color = "black";
      break;
    case "01n":
      wellBack.style.background = "#604878";
      wellText.style.color = "white";
      break;
    case "02d": // few clouds
      wellBack.style.background = "#7EC0EE";
      wellText.style.color = "black";
      break;
    case "02n":
      wellBack.style.background = "#604878";
      wellText.style.color = "white";
      break;
    case "03d": // scattered clouds
      wellBack.style.background = "#7EC0EE";
      wellText.style.color = "black";
      break;
    case "03n":
      wellBack.style.background = "#301860";
      wellText.style.color = "white";
      break;
    case "04d": // broken clouds
      wellBack.style.background =  "#7EC0EE";
      wellText.style.color = "black";
      break;
    case "04n":
      wellBack.style.background = "#301860";
      wellText.style.color = "white";
      break;
    case "09d": // shower rain
      wellBack.style.background =  "#4B738E";
      wellText.style.color = "black";
      break;
    case "09n":
      wellBack.style.background = "#001848";
      wellText.style.color = "white";
      break;
    case "10d": // rain
      wellBack.style.background =  "#4B738E";
      wellText.style.color = "white";
      break;
    case "10n":
      wellBack.style.background = "#604878";
      wellText.style.color = "white";
      break;
    case "11d": // thunderstorm
      wellBack.style.background =  "#001848";
      wellText.style.color = "white";
      break;
    case "11n":
      wellBack.style.background = "#001848";
      wellText.style.color = "white";
      break;
    case "13d": // snow
      wellBack.style.background =  "#fffafa";
      wellText.style.color = "black";
      break;
    case "13n":
      wellBack.style.background = "#483078";
      wellText.style.color = "white";
      break;
    case "50d": // mist
      wellBack.style.background =  "#7e7e7e";
      wellText.style.color = "white";
      break;
    case "50n":
      wellBack.style.background = "#3f3f3f";
      wellText.style.color = "white";
      break;

    default :
      wellBack.style.background = "white";
      wellText.style.color = "black"

  }
}

//construct the url that I want to send a request with
function updateByZip(zip) {
  var url = "http://api.openweathermap.org/data/2.5/weather?zip=" + zip +
          "&APPID=" + APIKey;
  sendRequest(url);
}


// send that url and use that data to make a weather object of city, temp, icon and description
function sendRequest(url) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

      var data = JSON.parse(xmlhttp.responseText);

      var weather = {};
      weather.city = data.name;
      weather.temp = data.main.temp;
      temp = data.main.temp; // global temp to use for toggling units
      weather.icon = data.weather[0].icon;
      weather.desc = data.weather[0].description;
      // if (weather.icon.slice(0,2) > 5) { weather.rain = true; } else {weather.rain = false;}
      update(weather);

    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

//translate our native kelvin temp to appropriate units
function kelvinsToF(kelvins) {
  return ((kelvins * (9/5)) - 459.67);
}

function kelvinsToC(kelvins) {
  return (kelvins - 273.15);
}

// use IP address to give a user's zip code
function getCurrentLocation() {
  $.getJSON('http://ipinfo.io', function(data) {
    updateByZip(data.postal);
  });
}

// use the data put in the search bar to perform a weather
function searchLocation() {
  var inputZip = document.getElementById("newSearch").value;
  updateByZip(inputZip);
}


// EVENT LISTENERS -- when buttons are clicked search new weather
document.getElementById("currentButton").addEventListener("click", function() {
  console.log("current location button was clicked");
  getCurrentLocation();
});

document.addEventListener("DOMContentLoaded", function (event) {
    var _selector = document.querySelector('input[name=units]');
    _selector.addEventListener('change', function (event) {
        if (_selector.checked) {
            document.getElementById("temp").innerHTML = Math.round(kelvinsToF(temp)) + "&#8457;";
        } else {
            document.getElementById("temp").innerHTML = Math.round(kelvinsToC(temp)) + "&#8451;";
        }
    });
});

document.getElementById("searchButton").addEventListener("click", function(){
  console.log("search location was clicked")
  var inputZip = document.getElementById("newSearch");
  if (inputZip.value.length != 5 || isNaN(inputZip.value)) {
    inputZip.placeholder="Please enter valid zip";
    alert("Sorry, that is not a valid zip code");
  }
  else {
    updateByZip(inputZip.value);
  }
});

// default location is new york city
$(document).ready(function() {
      updateByZip(10020);
      $('#newSearch').keypress(function(key) {
        if (key.which==13){
          console.log("enter was clicked");
          var zip = document.getElementById("newSearch").value;
          updateByZip(zip);
        }
      });
});
