function getDeviceInfo(userAgentRaw = ""){
    const ua = (userAgentRaw || "").toLocaleLowerCase();

    let loginType = "WEB";
    let deviceType = "WEB";

    if(ua.includes("iphone") || ua.includes("ipad")){
        loginType = "IOS";
    } else if (ua.includes("android")) {
        loginType = "ANDROID";
    } else {
        loginType = "WEB";
    }

    if (ua.includes("iphone")) {
        deviceType = "iPhone";

    } else if (ua.includes("ipad")) {
        deviceType = "iPad";

    } else if (ua.includes("android")) {
    if (ua.includes("mobile")) deviceType = "Android Phone";
    else deviceType = "Android Tablet";

    } else if (ua.includes("windows")) {
    if (ua.includes("chrome")) deviceType = "Chrome on Windows";
    else if (ua.includes("firefox")) deviceType = "Firefox on Windows";
    else if (ua.includes("edge")) deviceType = "Edge on Windows";
    else deviceType = "Windows (Unknown Browser)";

    } else if (ua.includes("mac os") || ua.includes("macintosh")) {
    if (ua.includes("chrome")) deviceType = "Chrome on macOS";
    else if (ua.includes("safari")) deviceType = "Safari on macOS";
    else if (ua.includes("firefox")) deviceType = "Firefox on macOS";
    else deviceType = "macOS (Unknown Browser)";

    } else {
    deviceType = "Unknown";
    }

    return { loginType, deviceType };
}

module.exports = getDeviceInfo;
