require(['iconHandler'], function(iconHandler) {

  doGoogleAnalytics();
  updatePhase();

  function doGoogleAnalytics() {
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-9963785-2']);
    _gaq.push(['_trackPageview']);

    (function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = 'https://ssl.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
  }

  function updatePhase() {
    if (isCitySelected()) {
      showSpinner();
      requestPhaseForCity({
        onError : function(error) {
          showError(error);
        },
        onSuccess : function(response) {
          hideSpinner();
          var massagedResponse = getMassagedResponse(response);
          showPhase(massagedResponse);
        }
      });
    } else {
      showSetOptionsDialogue();
      setOptionsBadge();
    }
  }

  function requestPhaseForCity(callbacks) {
    var wundergroundAstronomyBaseURL = "http://api.wunderground.com/api/45151a5acf9543af/astronomy";
    var formatParameter = ".json";
    var getCityDataUrl = wundergroundAstronomyBaseURL + getSelectedCityCode() + formatParameter;

    var req = new XMLHttpRequest();
    req.open("GET", getCityDataUrl, true);
    req.timeout = 10000;
    req.ontimeout = function() {
      callbacks.onError("Timeout");
    };
    req.onload = function() {
      if (req.status != 200) {
        callbacks.onError(req.status);
      } else {
        var jsonResponse = JSON.parse(req.responseText);
        if (!jsonResponse.response) {
          callbacks.onError("No response in JSON");
        } else if (jsonResponse.response.error) {
          callbacks.onError("Error in response");
        } else {
          callbacks.onSuccess(jsonResponse.moon_phase);
        }
      }
    };
    req.send();
  }

  function isCitySelected() {
    return (localStorage.getItem("chosenCityCode") != undefined);
  };

  function getSelectedCityCode() {
    return (localStorage.getItem("chosenCityCode"));
  };

  function getSelectedCityName() {
    return (localStorage.getItem("chosenCityName"));
  };

  function getMassagedResponse(response) {
    var percentIlluminated = response.percentIlluminated;
    var ageOfMoon = response.ageOfMoon;
    var sunrise = response.sunrise.hour + ":" + response.sunrise.minute;
    var sunset = response.sunset.hour + ":" + response.sunset.minute;

    return {
      "percentIlluminated" : percentIlluminated,
      "ageOfMoon" : ageOfMoon,
      "sunrise" : sunrise,
      "sunset" : sunset
    };
  }

  function showPhase(moonData) {
    appendMoonDataToPopup(moonData.ageOfMoon, moonData.percentIlluminated, moonData.sunrise, moonData.sunset);
    appendImageToPopup(moonData.ageOfMoon);
    appendCityInformationToPopup();
    setPhaseIcon(moonData.ageOfMoon);
  }

  function showError() {
    error = document.getElementById("error");
    error.style.display = "block";
    document.getElementById("main").className = "expandedMain";
  }

  function setPhaseIcon(ageOfMoon) {
    resetBadge();
    var iconPath = iconHandler.getIconForMoon(ageOfMoon);
    setIcon(iconPath);
  }

  function resetBadge() {
    chrome.browserAction.setBadgeBackgroundColor({color:[190, 190, 190, 230]});
    chrome.browserAction.setBadgeText({text:""});
  }

  /* Not used */
  function setErrorBadge() {
    chrome.browserAction.setBadgeBackgroundColor({color:[250, 0, 0, 230]});
    chrome.browserAction.setBadgeText({text:"!"});
  }

  function setOptionsBadge() {
    chrome.browserAction.setBadgeBackgroundColor({color:[190, 190, 190, 230]});
    chrome.browserAction.setBadgeText({text:"?"});
  }

  function setIcon(iconPath) {
    chrome.browserAction.setIcon({path: iconPath});
  }

  function showSetOptionsDialogue() {
    setOptionsDialogue = document.getElementById("setOptionsDialogue");
    setOptionsDialogue.style.display = "block";
    optionsUrl = chrome.extension.getURL("view/options.html");
    setOptionsDialogue.innerHTML = "You need to select your city in order to determine the time for sunset and sunrise. <br /><br /> <a href='" + optionsUrl + "' target='_blank'>Select city</a>";

    document.getElementById("main").className = "expandedMain";
  }

  function appendCityInformationToPopup() {
    optionsUrl = chrome.extension.getURL("view/options.html");
    document.getElementById("forCity").innerHTML = "Showing data for " + getSelectedCityName() + "<a href='" + optionsUrl + "' target='_blank'>" + " (change)</a>";
  }

  function appendMoonDataToPopup(ageOfMoon, percentIlluminated, sunrise, sunset) {
    var percentIlluminatedElement = document.getElementById("percentIlluminated");
    var sunRiseElement = document.getElementById("sunRise");
    var sunSetElement = document.getElementById("sunSet");
    var ageOfMoonElement = document.getElementById("ageOfMoon");
    var moonStateElement = document.getElementById("moonState");

    percentIlluminatedElement.innerHTML = percentIlluminated + "%";
    sunRiseElement.innerHTML = sunrise;
    sunSetElement.innerHTML = sunset;
    ageOfMoonElement.innerHTML = ageOfMoon + (ageOfMoon == 1 ? " day" : " days");
    var phase = getPhase(ageOfMoon, percentIlluminated);
    moonStateElement.innerHTML = phase;

    document.getElementById("footer").style.display = "block";
  }

  function appendImageToPopup(ageOfMoon) {
    var imageSource = getImageForMoon(ageOfMoon);
    var moonImage = document.createElement("img");
    moonImage.src = imageSource;
    moonImage.className = "moonImage";
    document.getElementById("moonImagePlaceholder").appendChild(moonImage);
  }

  function getPhase(ageOfMoon, percentIlluminated) {
    if (0 <= ageOfMoon && ageOfMoon <= 5) {
      return "Waxing crescent";
    } else if (6 <= ageOfMoon && ageOfMoon <= 8) {
      return "First quarter";
    } else if ((9 <= ageOfMoon && ageOfMoon <= 14) && (percentIlluminated < 99)) {
      return "Waxing gibbous";
    } else if ((14 <= ageOfMoon && ageOfMoon <= 16) && (99 <= percentIlluminated)) {
      return "Full moon";
    } else if ((16 <= ageOfMoon && ageOfMoon <= 19) && (percentIlluminated < 99)) {
      return "Waning gibbous";
    } else if (20 <= ageOfMoon && ageOfMoon <= 22) {
      return "Last quarter";
    } else if (23 <= ageOfMoon && ageOfMoon <= 27) {
      return "Waning crescent";
    } else if (28 <= ageOfMoon && ageOfMoon <= 30) {
      return "New moon";
    } else {
      return "";
    }
  }

  function getImageForMoon(ageOfMoon) {
    return "../images/moons/" + ageOfMoon + ".png";
  }

  function showSpinner() {
    var spinnerElement = document.getElementById("spinner");
    spinnerElement.style.display = "inline";
  }

  function hideSpinner() {
    var spinnerElement = document.getElementById("spinner");
    spinnerElement.style.display = "none";
  }

});
