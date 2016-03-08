define([
    'jquery',
    'knockout',
    'durandal/system',
    'modules/core/services/navigationService',
    'modules/core/helper/uiHelper',
], function ($, ko, system, navigationService, uiHelper) {
    "use strict";

    var lastCallFailed = ko.observable();
    var lastError = ko.observable();
    var traceRouteArray = [];
    var systemLogFunction;
    var lastFullErrorInfo = ko.observable();
    var errorWatcher = {
        init: init,
        lastCallFailed: lastCallFailed,
        lastError: lastError,
        lastFullErrorInfo: lastFullErrorInfo,
        traceRouteArray: traceRouteArray,
        hasErrors: hasErrors,
        clearErrors: clearErrors,
        parseErrorInfoToString: parseErrorInfoToString
    };
    return errorWatcher;

    function init() {
        systemLogFunction = system.log;
        system.log = watchLog;
        setupGlobalErrorEvents();
    }
    function setupGlobalErrorEvents() {
        requirejs.onError = function (ex) {
        //    uiHelper.hideBusy();
        //    errorWatcher.lastError(ex);
        //    if (ex.responseText) {
        //        errorWatcher.lastFullErrorInfo($.parseJSON(ex.responseText));
        //    }
        //    console.log(ex);
            //navigationService.gotoErrorPage();
            return true;
        };

        $(document).ajaxError(function (event, xhr, settings, ex) {
            uiHelper.hideBusy();
            uiHelper.hideBusyQuoterRepricing();
            if (xhr.status === 0 && ex === 'timeout') {
                errorWatcher.lastError(xhr);
                if (xhr.responseText) {
                    errorWatcher.lastFullErrorInfo($.parseJSON(xhr.responseText));
                }
            }
            else if ((xhr.status === 0 && ex !== "abort") || xhr.status === 400 || xhr.status === 404) {
                errorWatcher.lastError(xhr);
                if (xhr.responseText) {
                    errorWatcher.lastFullErrorInfo($.parseJSON(xhr.responseText));
                }
                navigationService.gotoErrorPage();
            }
        });

        window.onerror = function errorHandler(errorMsg, url, lineNumber, column, errorObj) {
            uiHelper.hideBusy();
            //errorWatcher.lastError(arguments);
            errorWatcher.lastError(errorMsg);
            console.error(errorMsg);
            navigationService.gotoErrorPage();
            return true;
        };
    }
    function watchLog() {
        systemLogFunction.apply(system, Array.prototype.slice.call(arguments, 0));
        try {
            var args = arguments;

            inspectArgs(args);

        } catch (e) {
            console.log(e);
        }
    }
    function hasErrors() {
        return lastError() !== undefined && lastError() !== null;
    }

    function clearErrors() {
        lastError(undefined);
        lastFullErrorInfo(null);
    }

    function inspectArgs(args) {
        if (args !== undefined && args !== null) {
            var message = args[0];
            if (message instanceof Error) {
                notifyOfError(message);
            }
            else {
                addMessage(args);
            }

            if (traceRouteArray.length > 15) {
                traceRouteArray.shift();
            }
        }
    }

    function notifyOfError(messageError) {
        var message = messageError.message;

        try {
            if (messageError.fileName) {
                addMessage(messageError.fileName);
            }
        } catch (e) {
        }

        lastErrorMessage(message);
    }

    function addMessage(args) {
        if (!hasErrors()) {
            if (Array.isArray(args)) {
                addMessageFromArray(args);
            }
            else if (typeof args === "object") {
                addMessageFromObject(args);
            }
            else {
                traceRouteArray.push(args.toString());
            }
        }
    }

    function addMessageFromObject(obj) {
        var s = '';
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                s += prop + ':' + obj[prop] + ", ";
            }
        }
        addMessage(s);
    }

    function addMessageFromArray(args) {
        var s = '';
        for (var i = 0; i < args.length; i++) {
            s += args[i].toString() + ', ';
        }
        addMessage(s);
    }
    function parseErrorInfoToString(errorInfo) {
        var s = '';
        for (var prop in errorInfo) {
            if (errorInfo.hasOwnProperty(prop)) {
                s += prop + ':';
                if (typeof (errorInfo[prop]) === "object" && (errorInfo[prop]) !== null) {
                    s += ' { ' + parseErrorInfoToString(errorInfo[prop]) + ' }, ';
                } else {
                    s += errorInfo[prop] + ', ';
                }
            }
        }
        return s;
    }
});