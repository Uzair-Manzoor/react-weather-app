/**
 * Created by rafael on 15/02/17.
 */
import weather from './weather';

$(()=> {

    // Registering Service Workers
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('service-worker.js')
            .then(function () {
                console.log("Service Worker Registered");
            });
    }

    const assignData = (app) => {
        $('#weather-icon').addClass('wi wi-yahoo-' + app.weatherCode);
        $('#location').html(app.location);
        $('#weather').html(app.weatherDescription);
        $('.weather-temp-number').text(app.weatherTempC);
        $('.weather-temp-type').text(' ºC');
    };

    const refreshData = () => {
        $('#weather-icon').removeClass().addClass('weather-icon');
        $('#location').html('Loading location...');
        $('#weather').html('Loading data...');
        $('.weather-temp-number').text('');
        $('.weather-temp-type').text('');
    };

    const showAlertMessage = () => {
        var elm = $('.alert')[0];
        var newone = elm.cloneNode(true);
        elm.parentNode.replaceChild(newone, elm);

        $(newone).addClass('alert-show-message');
    };

    const errorHandler = (app) => {
        if (0 === app.errorCode) {
            showAlertMessage();
        }
    };

    const changeWeatherUnit = (app) => {

        const changeUnit = {
            K: 'C',
            C: 'F',
            F: 'K'
        };
        app.weatherTempActive = changeUnit[app.weatherTempActive];

        $('.weather-temp-number').text(app['weatherTemp' + app.weatherTempActive]);
        $('.weather-temp-type').text(' º' + app.weatherTempActive);
    };

    const app = weather();
    app.getData(assignData, errorHandler);

    $('.weather-temp-type').on('click', () => changeWeatherUnit(app));
    $('#card-refresh').on('click', () => {
        refreshData();
        app.getData(assignData, errorHandler);
    });

});
