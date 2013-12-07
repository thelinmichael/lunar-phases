define(["json!../config.json"], function(config) {

  return {

    getPhaseForCity : function(cityCode, callbacks) {
      if (_cacheIsValid()) {
        console.log("Cache valid.");
        callbacks.onSuccess(_getPhaseFromCache());
      } else {
        console.log("Cache invalid.");
        _makePhaseRequest(cityCode, {
          onSuccess : function(response) {
            _cacheResponse(response);
            callbacks.onSuccess(_getPhaseFromCache());
          },
          onError : function(error) {
            callbacks.onError(error);
          }
        });
      }
    },

    getCities : function(query, callbacks) {
      var wundergroundCityBaseURL = "http://autocomplete.wunderground.com/aq?format=JSON&query=";
      var req = new XMLHttpRequest();

      req.open("GET", wundergroundCityBaseURL + query, true);
      req.timeout = 8000;
      req.ontimeout = function() {
        callbacks.onError("Timeout");
      }
      req.onload = function() {
        var massagedData = _getCodeAndCities(req.responseText);
        callbacks.onSuccess(massagedData);
      };
      req.send();
    }

  };

  function _getCodeAndCities(response) {
    var jsonResponse = JSON.parse(response);
    var codeToNameMap = {};

    for (var i = 0; i < jsonResponse.RESULTS.length; i++) {
      if (jsonResponse.RESULTS[i].type == "city") {
        var cityName = jsonResponse.RESULTS[i].name;
        var cityCode = jsonResponse.RESULTS[i].l;
        codeToNameMap[cityCode] = cityName;
      }
    }
    return codeToNameMap;
  };

  function _makePhaseRequest(cityCode, callbacks) {
    var wundergroundAstronomyBaseURL = "http://api.wunderground.com/api/" + config.keys.weatherUnderground + "/astronomy";
    var formatParameter = ".json";
    var getCityDataUrl = wundergroundAstronomyBaseURL + cityCode + formatParameter;

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
          var massagedResponse = _getMassagedResponse(jsonResponse.moon_phase);
          callbacks.onSuccess(massagedResponse);
        }
      }
    };
    req.send();
  };

  function _getMassagedResponse(response) {
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

  function _cacheResponse(response) {
    _setCacheTime(new Date().getTime());
    var stringifiedResponse = JSON.stringify(response);
    localStorage['cachedResponse'] = stringifiedResponse;
  };

  function _getPhaseFromCache() {
    var cachedResponse = localStorage['cachedResponse'];
    return JSON.parse(cachedResponse);
  };

  function _setCacheTime(time) {
    localStorage['cacheTime'] = time;
  };

  function _cacheIsValid() {
    var cacheTime = localStorage['cacheTime'];
    var now = new Date().getTime();
    return (cacheTime && now < Number(cacheTime) + Number(config.cache.timeout));
  };

});