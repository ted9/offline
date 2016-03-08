define([
    "config/appConstants",
    "modules/core/models/enums"
],function (config, enums) {
    "use strict";

    var logger = {
        info: function () { },
        error: function () { },
        warn: function () { }
    };
    if (config.runMode == enums.appRunMode.debug)
    {
        logger = {
            info: info,
            error: error,
            warn: warn
        };
    }
    return logger;

    function info() {
        var strToWrite = String.format(arguments);
        console.info(strToWrite);
    }

    function error() {
        var strToWrite = String.format(arguments);
        console.error(strToWrite);
    }

    function warn() {
        var strToWrite = String.format(arguments);
        console.warn(strToWrite);
    }
});
