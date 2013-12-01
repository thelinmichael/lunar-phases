var req = new XMLHttpRequest();

updateChosenCityName();

function updateChosenCityName() {
	city = localStorage["chosenCityName"];

	if (city) {
		document.getElementById("currentCity").innerHTML = city;
	} else {
		document.getElementById("currentCity").innerHTML = "None chosen yet. Please type the name of a city below.";
	}
}

function getCities() {
	query = document.getElementById("citiesQueryBox").value;
	if (query != "") {
		showSpinner();
		req.open("GET",
    		 "http://autocomplete.wunderground.com/aq?format=JSON&query=" + query,
    	      true);
		req.timeout = 8000;
		req.ontimeout = showError;
		req.onload = showCityResults;
		req.send(null);
	} else {
		hideSpinner();
		resetListOfCities();
	}
}

function showError() {
	console.log("Error occured while fetching cities. Please try again later.");
}

function showCityResults() {
	hideSpinner();
	codeToNameMap = getCodeAndCitiesFromResponse(req.responseText);
	resetListOfCities();
	showListOfCities(codeToNameMap);
}

function resetListOfCities() {
	cities = document.getElementById("cities");
	while (cities.firstChild) {
	    cities.removeChild(cities.firstChild);
	}
}

function showListOfCities(codeToNameMap) {
	for (var key in codeToNameMap) {
		cities.appendChild(createListElement(key, codeToNameMap[key]));
		cities.appendChild(cityListElement);
		cities.appendChild(document.createElement("br"));
	}
}

function createListElement(code, name) {
	cityListElement = document.createElement("span");
	cityListElement.innerHTML = name;
	cityListElement.className = "cityListElement";
	cityListElement.onclick = function() { chooseCity(code, name); resetListOfCities(); resetCityInput(); };
	cityListElement.onmouseover = function() { this.className = "cityListElement highLighted"; }
	cityListElement.onmouseout = function() { this.className = "cityListElement"; }
	return cityListElement;
}

function resetCityInput() {
	document.getElementById("citiesQueryBox").value = "";
}

function chooseCity(code, name) {
	localStorage["chosenCityCode"] = code;
	localStorage["chosenCityName"] = name;
	updateChosenCityName();
	resetBadge();
}

function resetBadge() {
    chrome.browserAction.setBadgeBackgroundColor({color:[190, 190, 190, 230]});
    chrome.browserAction.setBadgeText({text:""});
}

function getCodeAndCitiesFromResponse(response) {
	jsonResponse = JSON.parse(req.responseText);
    codeToNameMap = {}
	for (var i = 0; i < jsonResponse.RESULTS.length; i++) {
		if (jsonResponse.RESULTS[i].type == "city") {
		    cityName = jsonResponse.RESULTS[i].name;
		    cityCode = jsonResponse.RESULTS[i].l;
		    codeToNameMap[cityCode] = cityName;
		}
    }
    return codeToNameMap;
}

function showSpinner() {
 	document.getElementById("citiesQueryBox").className = "spinner";
}

function hideSpinner() {
 	document.getElementById("citiesQueryBox").className = "";
}

document.getElementById("citiesQueryBox").addEventListener('keyup', getCities);