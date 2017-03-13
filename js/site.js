
weatherType = {
    id200: 'Thunderstorm with Light Rain'
    , id201: 'Thunderstorm with Rain'
    , id202: 'Thunderstorm with Heavy Rain'
    , id210: 'Light Thunderstorm'
    , id211: 'Thunderstorm'
    , id212: 'Heavy Thunderstorm'
    , id221: 'Ragged Thunderstorm'
    , id230: 'Thunderstorm with Light Drizzle'
    , id231: 'Thunderstorm with Drizzle'
    , id232: 'Thunderstorm with Heavy Drizzle'

    , id300: 'Light Intensity Drizzle'
    , id301: 'Drizzle'
    , id302: 'Heavy Intensity Drizzle'
    , id310: 'Light Intensity Drizzle Rain'
    , id311: 'Drizzle Rain'
    , id312: 'Heavy Intensity Drizzle Rain'
    , id321: 'Shower Drizzle'

    , id500: 'Light Rain'
    , id501: 'Moderate Rain'
    , id502: 'Heavy Intensity Rain'
    , id503: 'Very Heavy Rain'
    , id504: 'Extreme Rain'
    , id511: 'Freezing Rain'
    , id520: 'Light Intensity Shower Rain'
    , id521: 'Shower Rain'
    , id522: 'Heavy Intensity Shower Rain'

    , id600: 'Light Snow'
    , id601: 'Snow'
    , id602: 'Heavy Snow'
    , id611: 'Sleet'
    , id621: 'Shower Snow'
    , id622: 'Heavy Shower Snow'

    , id701: 'Mist'
    , id711: 'Smoke'
    , id721: 'Haze'
    , id731: 'Sand/Dust Whirls'
    , id741: 'Fog'
    , id751: 'Sand'

    , id800: 'Sky is Clear'
    , id801: 'Few Clouds'
    , id802: 'Scattered Clouds'
    , id803: 'Broken Clouds'
    , id804: 'Overcast Clouds'

    , id900: 'Tornado'
    , id901: 'Tropical Storm'
    , id902: 'Hurricane'
    , id903: 'Cold'
    , id904: 'Hot'
    , id905: 'Windy'
    , id906: 'Hail'
};

$(document).ready(function () {
    updateData();
    getCoordinates(updateData);
});

function getCoordinates(callback) {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
            localStorage.latitude = position.coords.latitude;
            localStorage.longitude = position.coords.longitude;
            callback();
        });
    }
}

function getLocalStorageCoordinates() {
    var latitude = localStorage.getItem("latitude");
    var longitude = localStorage.getItem("longitude");
    return latitude != null ? {latitude: latitude, longitude: longitude} : null;
}

function isCelsius() {
    var units =  localStorage.getItem("units");
    return units == "C" || units == null;
}

function changeUnitFormat() {
    var units = localStorage.getItem("units");
    localStorage.setItem("units", (units == "F" ? "C" : "F"));
    updateData();
}

function updateData() {
    var data = {APPID: "783f2c3fbf8654fdcadad831498b7dcf"}; // Normally you want to avoid exposing API keys on CodePen, but we haven't been able to find a keyless API for weather.
    data.units = isCelsius() ? "metric" : "imperial";
    var position = getLocalStorageCoordinates();
    if (position == null)
        data.q = "London,uk";
    else {
        data.lat = position.latitude;
        data.lon = position.longitude;
    }

    $.ajax({
        dataType: "json",
        url: "http://api.openweathermap.org/data/2.5/weather",
        data: data,
        success: renderData
    });
}

function renderData(data) {
    console.log(data);
    var preparedData = {
        location: "Weather in " + data["name"]  + ", " + data["sys"]["country"],
        icon: "http://openweathermap.org/img/w/" + data["weather"][0]["icon"] + ".png",
        weatherMain: weatherType["id" + data["weather"][0]["id"]],
        temperature: data["main"]["temp"] + " °" + (isCelsius()  ? "C" : "F"),
        changer: (isCelsius() ? 'make Fahrenheit?' : 'make Celsius?'),
        time: "get at " + new Date().toLocaleString(),
        wind: data["wind"]["speed"] + " meter/sec<br>" + data["wind"]["deg"] + "°",
        cloudiness: data["clouds"]["all"] + " %",
        pressure: data["main"]["pressure"] + " hpa",
        humidity: data["main"]["humidity"] + " %",
        sunrise: new Date(data["sys"]["sunrise"] * 1000).toLocaleTimeString(),
        sunset: new Date(data["sys"]["sunset"] * 1000).toLocaleTimeString(),
        geoCoords: "[" + data["coord"]["lat"] + ', ' + data["coord"]["lon"] + "]"
    };

    Object.keys(preparedData).forEach(function (key) {
        var element = document.getElementById(key);
        if (key == "icon")
            element.src = preparedData[key];
        else
            element.innerHTML = preparedData[key];
    })
}

