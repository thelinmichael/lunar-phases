require.config({
  paths : {
    json : 'vendor/json'
  }
});

require(['iconHandler', 'wunderground'], function(iconHandler, wunderground) {

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
		wunderground.requestCities(getQuery(), {
			onError : function(error) {
				hideSpinner();
			},
			onSuccess : function(response) {
				hideSpinner();
				resetListOfCities();
				showListOfCities(response);
			}
		});
	};

	function queryIsLongEnough() {
		return (getQuery().length > 1);
	};

	function getQuery() {
		return document.getElementById("citiesQueryBox").value;
	};

	/* TODO: Handle error. */
	function showError() {
		console.log("Error occured while fetching cities. Please try again later.");
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

});