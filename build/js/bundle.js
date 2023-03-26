/**
 * Created by rafael on 17/02/17.
 */
var weatherProto = {

    lat: 0,
    lon: 0,
    location: '',
    weatherCode: -1,
    weatherDescription: '',
    weatherTempActive: 'C',
    weatherTempK: 0,
    weatherTempC: 0,
    weatherTempF: 0,
    errorCode: -1,

    initialize: function initialize() {
        this.lat = 0;
        this.lon = 0;
        this.location = '';
        this.weatherCode = -1;
        this.weatherDescription = '';
        this.weatherTempActive = 'C';
        this.weatherTempK = 0;
        this.weatherTempC = 0;
        this.weatherTempF = 0;
        this.errorCode = -1;
    },
    getData: function getData(callbackSuccess, callbackError) {
        var _this = this;

        this.initialize();

        this.getLocation(function () {
            _this.yahooWeatherUri = 'https://query.yahooapis.com/v1/public/yql?' + 'q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20' + ('(SELECT%20woeid%20FROM%20geo.places%20WHERE%20text%3D%22(' + _this.lat + ',' + _this.lon + ')%22)') + '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

            _this.getWeather(callbackSuccess, callbackError);
        });
    },
    getLocation: function getLocation(callbackSuccess, callbackError) {
        var _this2 = this;

        navigator.geolocation.getCurrentPosition(function (data) {
            _this2.lat = Math.round(data.coords.latitude * 100) / 100;
            _this2.lon = Math.round(data.coords.longitude * 100) / 100;
            callbackSuccess();
        }, function (data) {
            _this2.errorCode = data;
            callbackError(_this2);
        });
    },
    getWeather: function getWeather(callbackSuccess, callbackError) {
        var _this3 = this;

        var cacheDataReceived = false;

        var assignData = function assignData(data) {
            _this3.location = data.query.results.channel.location.city + ', ' + data.query.results.channel.location.country;
            _this3.weatherCode = data.query.results.channel.item.condition.code;
            _this3.weatherDescription = data.query.results.channel.item.condition.text;
            _this3.weatherTempF = parseInt(data.query.results.channel.item.condition.temp);
            _this3.weatherTempK = Math.round((_this3.weatherTempF + 459.67) * 5 / 9);
            _this3.weatherTempC = Math.round(_this3.weatherTempK - 273.15);
        };

        // fetch fresh data
        var networkUpdate = function networkUpdate() {
            return new Promise(function (resolve, reject) {
                $.getJSON(_this3.yahooWeatherUri, {}).done(function (data) {
                    resolve(data);
                }).fail(function (data) {
                    _this3.errorCode = data.readyState; // 0 == No internet connection
                    reject(data);
                });
            });
        };

        var fetchDataIfCachesWorks = function fetchDataIfCachesWorks() {
            // fetch cached data
            // network == true  || cache == true   => network
            // network == true  || cache == false  => network
            // network == false || cache == true   => cache   (don't do anything (app displayed cached data before))
            // network == false || cache == false  => network (message: 'no internet connection')
            var promise = caches.match(_this3.yahooWeatherUri).then(function (data) {
                if (!data) throw new Error("No data");
                return data.json();
            }).then(function (data) {
                assignData(data);
                callbackSuccess(_this3);
                cacheDataReceived = true;
                return networkUpdate();
            }, function () {
                return networkUpdate();
            }).then(function (data) {
                assignData(data);
                callbackSuccess(_this3);
            }, function () {
                if (!cacheDataReceived) {
                    // no network connection and geolocation is different than cached geolocation
                    switch (errorCode) {
                        case 0:
                            _this3.location = 'No internet connection';
                            break;
                    }
                    callbackSuccess(_this3);
                }
                callbackError(_this3);
            });
        };

        var fetchDataIfCachesUndefined = function fetchDataIfCachesUndefined() {
            networkUpdate().then(function (data) {
                assignData(data);
                callbackSuccess(_this3);
            }, function () {
                callbackError(_this3);
            });
        };

        if ('undefined' == typeof caches) {
            fetchDataIfCachesUndefined();
        } else {
            fetchDataIfCachesWorks();
        }
    }
};

var weather$1 = weather = function weather() {
    return Object.assign({}, weatherProto);
};

/**
 * Created by rafael on 15/02/17.
 */
$(function () {

    // Registering Service Workers
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js').then(function () {
            console.log("Service Worker Registered");
        });
    }

    var assignData = function assignData(app) {
        $('#weather-icon').addClass('wi wi-yahoo-' + app.weatherCode);
        $('#location').html(app.location);
        $('#weather').html(app.weatherDescription);
        $('.weather-temp-number').text(app.weatherTempC);
        $('.weather-temp-type').text(' ºC');
    };

    var refreshData = function refreshData() {
        $('#weather-icon').removeClass().addClass('weather-icon');
        $('#location').html('Loading location...');
        $('#weather').html('Loading data...');
        $('.weather-temp-number').text('');
        $('.weather-temp-type').text('');
    };

    var showAlertMessage = function showAlertMessage() {
        var elm = $('.alert')[0];
        var newone = elm.cloneNode(true);
        elm.parentNode.replaceChild(newone, elm);

        $(newone).addClass('alert-show-message');
    };

    var errorHandler = function errorHandler(app) {
        if (0 === app.errorCode) {
            showAlertMessage();
        }
    };

    var changeWeatherUnit = function changeWeatherUnit(app) {

        var changeUnit = {
            K: 'C',
            C: 'F',
            F: 'K'
        };
        app.weatherTempActive = changeUnit[app.weatherTempActive];

        $('.weather-temp-number').text(app['weatherTemp' + app.weatherTempActive]);
        $('.weather-temp-type').text(' º' + app.weatherTempActive);
    };

    var app = weather$1();
    app.getData(assignData, errorHandler);

    $('.weather-temp-type').on('click', function () {
        return changeWeatherUnit(app);
    });
    $('#card-refresh').on('click', function () {
        refreshData();
        app.getData(assignData, errorHandler);
    });
});
