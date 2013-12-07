define(function() {

  return {

    getIconForMoon : function(ageOfMoon) {
      return "../images/browser-icons/" + ageOfMoon + ".png";
    },

    setPhaseIcon : function(ageOfMoon) {
      this.resetBadge();
      var iconPath = this.getIconForMoon(ageOfMoon);
      this.setIcon(iconPath);
    },

    setIcon : function(iconPath) {
      chrome.browserAction.setIcon({ path: iconPath });
    },

    resetBadge : function() {
      chrome.browserAction.setBadgeBackgroundColor({ color : [190, 190, 190, 230] });
      chrome.browserAction.setBadgeText({ text : "" });
    },

    setErrorBadge : function() {
      chrome.browserAction.setBadgeBackgroundColor({ color : [250, 0, 0, 230] });
      chrome.browserAction.setBadgeText({ text: "!" });
    },

    setOptionsBadge : function() {
      chrome.browserAction.setBadgeBackgroundColor({ color : [190, 190, 190, 230] });
      chrome.browserAction.setBadgeText({text : "?"});
    }

  }
});