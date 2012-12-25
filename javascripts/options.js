var req = new XMLHttpRequest();

function getCities() {
	query = document.getElementById("citiesQueryBox").value;	
	if (query != "") {
		req.open("GET",
    		 "http://autocomplete.wunderground.com/aq?format=JSON&query=" + query,
    	      true);
		req.timeout = 8000;
		req.ontimeout = showError;
		req.onload = showCityResults; 
		req.send(null);
	}
}

function showError() {
	console.log("Error occured while fetching cities.");
}

function showCityResults() {
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
		cityListElement = document.createElement("span");
		cityListElement.innerHTML = codeToNameMap[key];
		cityListElement.className = "cityListElement";
		document.getElementById(cityListElement).addEventListener('click', chooseCity);
		cities.appendChild(cityListElement);
		cities.appendChild(document.createElement("br"));
	}
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

document.getElementById("citiesQueryBox").addEventListener('keyup', getCities);