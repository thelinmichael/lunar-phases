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
    }

  }

});