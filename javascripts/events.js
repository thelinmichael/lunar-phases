var req = new XMLHttpRequest();

chrome.runtime.onStartup.addListener(function() {
	update();
});

// Call Wunderground API 
function update() {
  cityCode = localStorage["chosenCityCode"];
  if (cityCode) {
    url = "http://api.wunderground.com/api/45151a5acf9543af/astronomy" + cityCode  + ".json"; 
    req.open(
     "GET",
      url,
      true);
    req.timeout = 8000;
    req.ontimeout = setErrorIcon;
    req.onload = setPhaseIcon;     	 
    req.send(null);
  } else {
    setOptionsIcon();
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
	     if ((jsonResponse.response != null || jsonResponse.response != undefined) && (jsonResponse.response.error != null || jsonResponse.response.error != undefined)) {
                showError();
             }

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
