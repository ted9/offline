define([
    'toastr',
    'config/appConstants'
], function (toastr, config) {
    "use strict";

    toastr.options.positionClass = 'toast-top-full-width toastr-newest-on-top';
    toastr.options.closeButton = true;
    toastr.options.hideDuration = 300;

    var maxNotification = config.maxNotification;
    toastr.subscribe(function () {
        if (toastr.getContainer().children().length > maxNotification) {
            toastr.getContainer().children().last().remove();
        }
    });

    var notifier = {
        info: info,
        error: error,
        warn: warn
    };
    return notifier;

    function info(infoObj) {
        if (!infoObj.title) {
            infoObj.title = "";
        }
        toastr.info(infoObj.content, infoObj.title);
    }

    function error(errorObj) {
        if (!errorObj.title) {
            errorObj.title = "";
        }
        toastr.error(errorObj.content, errorObj.title);
    }

    function warn(warnObj) {
        if (!warnObj.title) {
            warnObj.title = "";
        }
        toastr.warning(warnObj.content, warnObj.title);
    }
});