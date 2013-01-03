var req = new XMLHttpRequest();
update();

function update() { 
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
    setOptionsIcon();
  }
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
    setPhaseIcon();
    setIcon(ageOfMoon);
    setUpdate();
  } else {
    showError();
  }
}

function setUpdate() {
  today = new Date();
  dd = today.getDate(); 
  mm = today.getMonth() + 1;
  yyyy = today.getFullYear();
  todayFormatted = dd + "/" + mm + "/" + yyyy;
  localStorage["lastUpdate"] = todayFormatted; 
}

// Error occured during call to API
function setErrorIcon() {
  chrome.browserAction.setBadgeBackgroundColor({color:[250, 0, 0, 230]});
  chrome.browserAction.setBadgeText({text:"!"});
} 

// Successful call, change icon to show the phase
function setPhaseIcon() {
   if (req.status == 200) {
      jsonResponse = JSON.parse(req.responseText);
      var ageOfMoon = jsonResponse.moon_phase.ageOfMoon;
      var imageSource = getIconForMoon(ageOfMoon);

    resetBadge();
      setIcon(imageSource);
    } else {
      showError();
    }
}

// Set a notifier that the user needs to set the options
function setOptionsIcon() {
  chrome.browserAction.setBadgeBackgroundColor({color:[190, 190, 190, 230]});
  chrome.browserAction.setBadgeText({text:"?"});
}

function resetBadge() {
    chrome.browserAction.setBadgeBackgroundColor({color:[190, 190, 190, 230]});
    chrome.browserAction.setBadgeText({text:""});
}

function setIcon(iconPath) {
  chrome.browserAction.setIcon({path: iconPath});
}

function getIconForMoon(ageOfMoon) {
  return "../images/browser-icons/" + ageOfMoon + ".png";
}

function showSetOptionsDialogue() {
  setOptionsDialogue = document.getElementById("setOptionsDialogue");
  setOptionsDialogue.style.display = "block";
  optionsUrl = chrome.extension.getURL("view/options.html");
  setOptionsDialogue.innerHTML = "You need to select your city in order to determine the time for sunset and sunrise. <br /><br /> <a href='" + optionsUrl + "' target='_blank'>Select city</a>";

  document.getElementById("main").className = "expandedMain";
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
  document.getElementById("main").className = "expandedMain";
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