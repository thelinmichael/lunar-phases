var req = new XMLHttpRequest();
//req.open(
//   "GET",
//    "http://api.wunderground.com/api/45151a5acf9543af/astronomy/q/Sweden/Stockholm.json",
//    true);
//showSpinner(true);
//req.timeout = 8000;
req.ontimeout = showError;
req.onload = showPhase; 

writeMoonDataToPage(10, 75);
appendImageToDocument(getImageForMoon(10));

//req.send(null);

function showPhase() {
  showSpinner(false);
  if (req.status == 200) {
    jsonResponse = JSON.parse(req.responseText);
    var percentIlluminated = jsonResponse.moon_phase.percentIlluminated; 
    var ageOfMoon = jsonResponse.moon_phase.ageOfMoon; 
    var imageSource = getImageForMoon(ageOfMoon);

    writeMoonDataToPage(ageOfMoon, percentIlluminated);
    appendImageToDocument(imageSource);
  } else {
    showError();
  }
}

function getImageForMoon(ageOfMoon) {
  return "../images/moons/" + ageOfMoon + ".png";
}

function appendImageToDocument(imageSource) {
  var moonImage = document.createElement("img");
  moonImage.src = imageSource; 
  moonImage.className = "moonImage"
  document.body.insertBefore(moonImage, document.getElementById("footer"));
}

function showError() {
  error = document.getElementById("error");
  error.style.display = "block"; 
}

function writeMoonDataToPage(ageOfMoon, percentIlluminated) {
  ageOfMoonElement = document.getElementById("ageOfMoon");
  percentIlluminatedElement = document.getElementById("percentIlluminated");

  ageOfMoonElement.innerHTML = ageOfMoon + " days";
  percentIlluminatedElement.innerHTML = percentIlluminated + "%";

  document.getElementById("footer").style.display = "block";
}

function showSpinner(shouldShow) {
  var spinnerElement = document.getElementById("spinner"); 
  if (shouldShow) {
    spinnerElement.style.display = "inline";
  } else {
    spinnerElement.style.display = "none";
  }
}