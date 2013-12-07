define(["json!../config.json"], function(config) {

  return {

    requestPhaseForCity : function(cityCode, callbacks) {
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
            callbacks.onSuccess(jsonResponse.moon_phase);
          }
        }
      };
      req.send();
    },

    requestCities : function(query, callbacks) {
      var wundergroundCityBaseURL = "http://autocomplete.wunderground.com/aq?format=JSON&query=";
      var req = new XMLHttpRequest();

      req.open("GET", wundergroundCityBaseURL + query, true);
      req.timeout = 8000;
      req.ontimeout = function() {
        callbacks.onError("Timeout");
      }
      req.onload = function() {
        var massagedData = getCodeAndCities(req.responseText);
        callbacks.onSuccess(massagedData);
      };
      req.send();
    }

  };

  function getCodeAndCities(response) {
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

});