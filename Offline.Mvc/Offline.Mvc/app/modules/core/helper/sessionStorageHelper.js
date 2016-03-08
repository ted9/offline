define([
    "config/appConstants"
], function (appConfig) {
    "use strict";
    var viewmodel = {
        getItem: getItem,
        setItem: setItem
    };
    return viewmodel;

    function getItem(key) {
        return JSON.parse(sessionStorage.getItem(String.format("{0}_{1}", appConfig.sessionId, key)));
    }

    function setItem(key, data) {
        sessionStorage.setItem(String.format("{0}_{1}", appConfig.sessionId, key), JSON.stringify(data));
    }
});
