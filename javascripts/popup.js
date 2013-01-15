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
  } else {
    showError();
  }
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
  percentIlluminatedElement = document.getElementById("percentIlluminated");
  sunRiseElement = document.getElementById("sunRise");
  sunSetElement = document.getElementById("sunSet");
  moonState = document.getElementById("moonState");
  percentIlluminatedElement.innerHTML = percentIlluminated + "%";
  sunRiseElement.innerHTML = sunrise;
  sunSetElement.innerHTML = sunset;

  var phase = "";
  if (ageOfMoon <= 1) {
    phase = "New moon";
  } else if (ageOfMoon > 1 && ageOfMoon < 6) {
    phase = "Waxing crescent";
  } else if (ageOfMoon == 6) {
    phase = "First quarter";
  } else if (ageOfMoon > 6 && ageOfMoon < 13) {
    phase = "Waxing gibbous";
  } else if (ageOfMoon >= 13 && ageOfMoon <= 14) {
    phase = "Full moon";
  } else if (ageOfMoon > 14 && ageOfMoon < 22) {
    phase = "Waning gibbous";
  } else if (ageOfMoon == 22) {
    phase = "Third quarter";
  } else if (ageOfMoon > 22 && ageOfMoon < 29) {
    phase = "Waning crescent";
  } else if (ageOfMoon == 29) {
    phase = "Dark moon"
  } 
  moonState.innerHTML = phase;

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