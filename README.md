# Lunar phases

Lunar phases is an extension for the Chrome browser. It's purpose is to show the current lunar phase along with some other useful data, for a city selected by the user. It uses [Weather Underground's API](http://www.wunderground.com/weather/api/).

Please see [Lunar phase's page on the Chrome Web Store](https://chrome.google.com/webstore/detail/lunar-phases/gonoapcaanboccgahfbaegafbckgmceh
) for screenshots and download.

### Improve it

I'm happy to release improved versions of this extension. Simply fork this repository and send a pull request, and I'll update the extension in the Web Store.

If you want to know how to develop Chrome extensions or want to install this extension without using the Web Store, please see [this page](http://developer.chrome.com/extensions/getstarted.html).


### Other
Lunar phases' in-browser icon updates to match the current lunar phase. This update is done when the icon is clicked. It can also update when the browser opens, but since this triggers way too many calls to the API, and since the API key is used for a free account with a limited amount of calls, the current phase either needs to be cached or kept as it is today.