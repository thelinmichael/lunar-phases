var req = new XMLHttpRequest();

cityCode = localStorage["chosenCityCode"];
if (cityCode) {
  url = "http://api.wunderground.com/api/45151a5acf9543af/astronomy" + cityCode  + ".json"; 
  console.log(url);
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
    var imageSource = getImageForMoon(ageOfMoon);

    writeMoonDataToPage(ageOfMoon, percentIlluminated);
    appendImageToDocument(imageSource);
    showCityInformation();
  } else {
    showError();
  }
}

function showSetOptionsDialogue() {
  setOptionsDialogue = document.getElementById("setOptionsDialogue");
  setOptionsDialogue.style.display = block;
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

function writeMoonDataToPage(ageOfMoon, percentIlluminated) {
  ageOfMoonElement = document.getElementById("ageOfMoon");
  percentIlluminatedElement = document.getElementById("percentIlluminated");

  ageOfMoonElement.innerHTML = ageOfMoon + " days";
  percentIlluminatedElement.innerHTML = percentIlluminated + "%";

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