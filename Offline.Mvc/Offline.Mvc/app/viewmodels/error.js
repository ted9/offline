define([
    'knockout',
    'modules/core/helper/logger/errorWatcher',
    'notifyLogger',
    'config/appSettings',
    'plugins/router',
    'modules/core/helper/deviceHelper',
    'languageHelper',
    'config/navPageButtonType',
    'modules/core/services/navigationService'
], function (ko, errorWatcher, notify, appSettings, router, deviceHelper, languageHelper, navPageButtonType, navigationService) {
    "use strict";
    var detailMessage = ko.observable("Internal Server Error");
    var messages = ko.observable();
    var fullErrorMessage = ko.observable();
    var vmError = {
        isMobile: ko.observable(false),
        detailMessage: detailMessage,
        fullErrorMessage: fullErrorMessage,
        showErrorDetails: showErrorDetails,
        emailErrorDetails: emailErrorDetails,
        returnUrl: '',
        messages: messages,
        activate: activate,
        pageNav: {
            leftCommand: { i18nTextKey: "common:string.empty", click: onBackClicked, text: "", type: navPageButtonType.back },
            midCommand: { i18nTextKey: "common:string.error", text: "", type: navPageButtonType.none },
            rightCommand: { i18nTextKey: "common:string.empty", text: "", type: navPageButtonType.hidden }
        },
        detached: detached,
        onBackClicked: onBackClicked
    };
    return vmError;


    function activate(params) {
        vmError.isMobile(deviceHelper.isMobile());
        vmError.returnUrl = _.isUndefined(params) || _.isUndefined(params.returnUrl) ? "" : params.returnUrl;
        fullErrorMessage(errorWatcher.parseErrorInfoToString(errorWatcher.lastFullErrorInfo()));
        if (errorWatcher.lastError() && errorWatcher.lastError().statusText) {
            detailMessage(errorWatcher.lastError().statusText);
        }
        if (!detailMessage || detailMessage() === "") {
            detailMessage(languageHelper.getString("errors.unknownError"));
        }
        messages(errorWatcher.traceRouteArray);
        return true;
    }

    function detached() {
        clearErrors();
    }

    function clearErrors() {
        errorWatcher.clearErrors();
    }

    function onBackClicked() {
        if (vmError.returnUrl === "") {
            history.back();
            return;
        }
        router.navigate("#" + vmError.returnUrl);
    }
    function showErrorDetails() {
        notify.error({ content: formatMessages() });
    }

    function emailErrorDetails() {
        var emailBody = formatMessages();
        window.location.href = String.format('mailto:{0}?subject={1}&body={2}',
            appSettings.supportEmail, "AMT Mobile Error", encodeURIComponent(emailBody));
    }

    function formatMessages() {
        var messageBody = 'SERVER: ' + window.location.hostname + '\n';
        var preUrl = navigationService.getCurrentUrlHashes().previousHash;
        messageBody += 'URL: ' + window.location.origin + (preUrl ? '#' + preUrl : '') + '\n\n';
        messageBody += 'TRACE ROUTE:\n';

        var messageArray = messages();

        for (var i = 0; i < messageArray.length; i++) {
            messageBody += messageArray[i] + '\n';
        }
        if (!String.isNullOrWhiteSpace(fullErrorMessage())) {
            messageBody += "ERROR DETAIL: " + fullErrorMessage();
        }
        return messageBody;
    }
});