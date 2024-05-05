chrome.cookies.onChanged.addListener(function(changeInfo) {
    console.log('Cookie changed:', changeInfo);
});

function clearCookies(sessionCookies, persistentCookies, thirdPartyCookies) {
    chrome.cookies.getAll({}, function(cookies) {
        var clearedCookies = [];
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            if (sessionCookies && cookie.session) {
                removeCookie(cookie);
                clearedCookies.push(cookie.name);
            }
            if (persistentCookies && !cookie.session) {
                removeCookie(cookie);
                clearedCookies.push(cookie.name);
            }
            if (thirdPartyCookies && isThirdPartyCookie(cookie)) {
                removeCookie(cookie);
                clearedCookies.push(cookie.name);
            }
        }
        if (clearedCookies.length > 0) {
            showNotification("Cookies Cleared", "The following cookies have been cleared: " + clearedCookies.join(", "));
        } else {
            showNotification("No Cookies Cleared", "No cookies were cleared.");
        }
    });
}


function removeCookie(cookie) {
    chrome.cookies.remove({
        url: "https://" + cookie.domain + cookie.path,
        name: cookie.name
    }, function(removedCookie) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
        } else {
            showNotification("Cookie Cleared", "Cookie '" + removedCookie.name + "' has been cleared.");
        }
    });
}

function isThirdPartyCookie(cookie) {
    return cookie.domain !== getDomainFromUrl(cookie.secure ? cookie.secureDomain : cookie.domain);
}

function getDomainFromUrl(url) {
    return url.split('.').slice(-2).join('.');
}

function showNotification(title, message) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "images/icon48.png",
        title: title,
        message: message
    });
}
