// adBlocker.js

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        // Define your ad-related URLs here
        var adUrls = [
            "doubleclick.net",
            "googleadservices.com",
            "advertising.com",
            // Add more ad-related URLs as needed
        ];

        // Check if the request URL matches any of the ad-related URLs
        for (var i = 0; i < adUrls.length; i++) {
            if (details.url.includes(adUrls[i])) {
                console.log("Blocking ad:", details.url);
                return { cancel: true }; // Block the request
            }
        }
        return { cancel: false }; // Allow the request
    },
    { urls: ["<all_urls>"] }, // Match all URLs
    ["blocking"]
);
