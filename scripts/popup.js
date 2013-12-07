require.config({
  paths : {
    json : 'vendor/json'
  }
});

require(['iconHandler', 'analytics', 'wunderground'], function(iconHandler, analytics, wunderground) {

  analytics.track();
  updatePhase();

  function updatePhase() {
    if (isCitySelected()) {
      showSpinner();
      wunderground.requestPhaseForCity(getSelectedCityCode(), {
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
      iconHandler.setOptionsBadge();
    }
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
    iconHandler.setPhaseIcon(moonData.ageOfMoon);
  }

  function showError() {
    error = document.getElementById("error");
    error.style.display = "block";
    document.getElementById("main").className = "expandedMain";
  }

  function showSetOptionsDialogue() {
    setOptionsDialogue = document.getElementById("setOptionsDialogue");
    setOptionsDialogue.style.display = "block";
    optionsUrl = chrome.extension.getURL("views/options.html");
    setOptionsDialogue.innerHTML = "You need to select your city in order to determine the time for sunset and sunrise. <br /><br /> <a href='" + optionsUrl + "' target='_blank'>Select city</a>";

    document.getElementById("main").className = "expandedMain";
  }

  function appendCityInformationToPopup() {
    optionsUrl = chrome.extension.getURL("views/options.html");
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
