# Lunar phases

Lunar phases is an extension for the Chrome browser. It's purpose is to show the current lunar phase along with some other useful data, for a city selected by the user. It uses [Weather Underground's API](http://www.wunderground.com/weather/api/).

Please see [Lunar phase's page on the Chrome Web Store](https://chrome.google.com/webstore/detail/lunar-phases/gonoapcaanboccgahfbaegafbckgmceh
) for screenshots and download.

### Improve it

I'm happy to release improved versions of this extension. Simply fork this repository and send a pull request, and I'll update the extension in the Web Store.

If you want to know how to develop Chrome extensions or want to install this extension without using the Web Store, please see [this page](http://developer.chrome.com/extensions/getstarted.html).


### Future stuff
1. Update icon on on browser start. (Icon currently only updates when it's clicked)
2. Moonrise and moonset times. This data isn't available to get from the Weather Underground API, and I haven't found an API that gives this away for free. Weather Underground has planned to add this for over a year now, so hopefully it'll be done soon.

### Change log

**1.6.0.** Added caching. Extension saves results from Weather Underground in local storage and uses it in future requests if they're less than an hour old. Otherwise it fetches new data from Weather Underground and caches it. Caching is necessary to avoid going above the maximum allowed number of API requests.

**1.5.1** Added Age Of Moon information to the popup.