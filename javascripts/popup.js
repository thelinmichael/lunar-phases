var req = new XMLHttpRequest();

cityCode = localStorage["chosenCityCode"];
if (cityCode) {
  url = "http://api.wunderground.com/api/45151a5acf9543af/astronomy" + cityCode  + ".json"; 
  req.open(
   "GET",
    url,
    true);
  showSpinner(true);
  req.timeout = 8000;
  req.ontimeout = showError;
  req.onload = showPhase; 
  req.send(null);
} else {
  showSetOptionsDialogue();
}

function showPhase() {
  showSpinner(false);
  if (req.status == 200) {
    jsonResponse = JSON.parse(req.responseText);
    var percentIlluminated = jsonResponse.moon_phase.percentIlluminated; 
    var ageOfMoon = jsonResponse.moon_phase.ageOfMoon;
    var sunrise = jsonResponse.moon_phase.sunrise.hour + ":" + jsonResponse.moon_phase.sunrise.minute;
    var sunset = jsonResponse.moon_phase.sunset.hour + ":" + jsonResponse.moon_phase.sunset.minute;
    var imageSource = getImageForMoon(ageOfMoon);

    writeMoonDataToPage(ageOfMoon, percentIlluminated, sunrise, sunset);
    appendImageToDocument(imageSource);
    showCityInformation();
  } else {
    showError();
  }
}

function showSetOptionsDialogue() {
  setOptionsDialogue = document.getElementById("setOptionsDialogue");
  setOptionsDialogue.style.display = "block";
  optionsUrl = chrome.extension.getURL("view/options.html");
  setOptionsDialogue.innerHTML = "Please set your city in the <a href='" + optionsUrl + "' target='_blank'> Lunar Phases options.</a>";
}

function showCityInformation() {
  optionsUrl = chrome.extension.getURL("view/options.html");
  document.getElementById("forCity").innerHTML = "Showing data for " + localStorage["chosenCityName"] + "<a href='" + optionsUrl + "' target='_blank'>" + " (change)</a>";
}

function getImageForMoon(ageOfMoon) {
  return "../images/moons/" + ageOfMoon + ".png";
}

function appendImageToDocument(imageSource) {
  var moonImage = document.createElement("img");
  moonImage.src = imageSource; 
  moonImage.className = "moonImage";
  document.getElementById("main").appendChild(moonImage);
}

function showError() {
  error = document.getElementById("error");
  error.style.display = "block"; 
}

function writeMoonDataToPage(ageOfMoon, percentIlluminated, sunrise, sunset) {
  ageOfMoonElement = document.getElementById("ageOfMoon");
  percentIlluminatedElement = document.getElementById("percentIlluminated");
  sunRiseElement = document.getElementById("sunRise");
  sunSetElement = document.getElementById("sunSet");
  ageOfMoonElement.innerHTML = ageOfMoon + " days";
  percentIlluminatedElement.innerHTML = percentIlluminated + "%";
  sunRiseElement.innerHTML = sunrise;
  sunSetElement.innerHTML = sunset;

  document.getElementById("footer").style.display = "block";
}

function showSpinner(shouldShow) {
  var spinnerElement = document.getElementById("spinner"); 
  if (shouldShow) {
    spinnerElement.style.display = "inline";
  } else {
    spinnerElement.style.display = "none";
  }
}