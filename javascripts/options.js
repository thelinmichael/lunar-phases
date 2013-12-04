appendSelectedCityOnPage();

function appendSelectedCityOnPage() {
	if (isCitySelected()) {
		appendCityName(getSelectedCityName());
	} else {
		appendCityName("None chosen yet. Please type the name of a city below.");
	}
};

function appendCityName(cityText) {
	document.getElementById("currentCity").innerHTML = cityText;
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

/* When the user presses key up in the input box */
document.getElementById("citiesQueryBox").addEventListener('keyup', updateListOfCities);

function updateListOfCities() {
	if (queryIsLongEnough()) {
		getCities();
  } else {
		resetListOfCities();
  }
}

function getCities() {
	showSpinner();
	requestCities({
		onError : function(error) {
			hideSpinner();
		},
		onSuccess : function(response) {
			hideSpinner();
			showCityResults(response);
		}
	});
};

function queryIsLongEnough() {
	return (getQuery().length > 1);
};

function getQuery() {
	return document.getElementById("citiesQueryBox").value;
};

function requestCities(callbacks) {
	var wundergroundCityBaseURL = "http://autocomplete.wunderground.com/aq?format=JSON&query=";
	var req = new XMLHttpRequest();

	req.open("GET", wundergroundCityBaseURL + getQuery(), true);
	req.timeout = 8000;
	req.ontimeout = function() {
		callbacks.onError("Timeout");
	}
	req.onload = function() {
		callbacks.onSuccess(req.responseText);
	};
	req.send();
};

/* TODO: Handle error. */
function showError() {
	console.log("Error occured while fetching cities. Please try again later.");
};

function showCityResults(response) {
	resetListOfCities();

	var codeToNameMap = getCodeAndCitiesFromResponse(response);
	showListOfCities(codeToNameMap);
};

function getCodeAndCitiesFromResponse(response) {
	var jsonResponse = JSON.parse(response);
  var codeToNameMap = {};

	for (var i = 0; i < jsonResponse.RESULTS.length; i++) {
		if (jsonResponse.RESULTS[i].type == "city") {
	    cityName = jsonResponse.RESULTS[i].name;
	    cityCode = jsonResponse.RESULTS[i].l;
	    codeToNameMap[cityCode] = cityName;
		}
  }
  return codeToNameMap;
};

function resetListOfCities() {
	var cities = document.getElementById("cities");
	while (cities.firstChild) {
	    cities.removeChild(cities.firstChild);
	}
};

function showListOfCities(codeToNameMap) {
	for (var key in codeToNameMap) {
		cities.appendChild(createListElement(key, codeToNameMap[key]));
		cities.appendChild(cityListElement);
		cities.appendChild(document.createElement("br"));
	}
};

function createListElement(code, name) {
	cityListElement = document.createElement("span");
	cityListElement.innerHTML = name;
	cityListElement.className = "cityListElement";
	cityListElement.onclick = function() { chooseCity(code, name); resetListOfCities(); resetCityInput(); };
	cityListElement.onmouseover = function() { this.className = "cityListElement highLighted"; }
	cityListElement.onmouseout = function() { this.className = "cityListElement"; }
	return cityListElement;
};

function resetCityInput() {
	document.getElementById("citiesQueryBox").value = "";
};

function chooseCity(code, name) {
	localStorage["chosenCityCode"] = code;
	localStorage["chosenCityName"] = name;
	appendSelectedCityOnPage();
	resetBadge();
};

function resetBadge() {
  chrome.browserAction.setBadgeBackgroundColor({color:[190, 190, 190, 230]});
  chrome.browserAction.setBadgeText({text:""});
};

function showSpinner() {
 	document.getElementById("citiesQueryBox").className = "spinner";
};

function hideSpinner() {
 	document.getElementById("citiesQueryBox").className = "";
};