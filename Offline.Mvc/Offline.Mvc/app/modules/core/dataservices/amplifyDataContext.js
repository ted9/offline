define([
    'amplify',
    'notifyLogger',
    'languageHelper',
    'modules/core/helper/uiHelper',
    'modules/core/helper/userProfileHelper',
    'modules/core/helper/logger/errorWatcher',
    'modules/core/services/navigationService'
], function (amplify, notify, languageHelper, uiHelper, userProfileHelper, errorWatcher, navigationService) {

    "use strict";

    //contain AmplifyDataContext instance
    var instance = null;
    var userProfile = null;
    var sendRepricingRequest = "sendRepricingRequest";
    var dataContextFactory = {
        getInstance: getInstance
    };
    //get the instance of AmplifyDataContext
    return dataContextFactory;

    function getInstance() {
        if (!instance) {
            instance = new ADataContext();
        }
        return instance;
    }

    function ADataContext() {
        var headers = {};
        var dataContext = {
            defineRequest: defineRequest,
            sendRequest: sendRequest,
            get: get,
            post: post,
            put: put,
            remove: remove
        };
        return dataContext;

        function defineRequest(resourceId, url, requestData, type) {
            if (!type) {
                type = "GET";
            }

            userProfile = userProfileHelper.getUserProfile();
            amplify.request.define(resourceId, "ajax", {
                url: url,
                dataType: "json",
                contentType: "application/json",
                data: type == "GET" ? requestData : JSON.stringify(requestData),
                //data: requestData,
                type: type,
                headers: { 'X-AUTH-TOKEN': userProfile.authToken },
                beforeSend: function (xhr, settings) {
                    uiHelper.showBusy();
                    return true;
                },
                complete: function (xhr, statusText) {
                    setTimeout(function () {
                        uiHelper.hideBusy();
                    }, 400);
                    return true;
                }
            });
        }

        function sendRequest(resourceId, callback, httpMethod) {
            var df = $.Deferred();
            amplify.request({
                resourceId: resourceId,
                //data: requestData,
                success: function (data, xhr) {
                    df.resolve(data, xhr);
                    if (callback && callback.success) {
                        callback.success(data, status);
                    }

                },
                error: function (data, xhr) {
                    var errorMessage = '';
                    var isNavigated = false;
                    //bad request
                    if (xhr.status === 400) {
                        isNavigated = true;
                        gotoError(xhr, httpMethod);
                    }
                        // Internal Server Error
                    else if (xhr.status === 500) {
                        var exception = JSON.parse(xhr.responseText);
                        if (exception && exception.exceptionType && exception.exceptionType.indexOf("System.") > -1) {
                            isNavigated = true;
                            gotoError(xhr, httpMethod);
                        } else if (xhr.responseText && xhr.responseText !== '') {
                            errorMessage = xhr.responseText.replace('"', '').replace('"', '');
                        }
                    }
                        // Check timeout
                    else if (xhr.status === 0 && xhr.statusText === "timeout") {
                        if (resourceId == sendRepricingRequest) {
                            notify.error({
                                title: "",
                                content: languageHelper.getString("term.repricingQuoterTimeout", "widget")
                            });
                            uiHelper.hideBusyQuoterRepricing();
                            return false;
                        } else {
                            errorMessage = languageHelper.getString("errors.timeout", "common");
                        }
                    }
                    else if (xhr.status === 401) {
                        document.location.href = '';
                        return false;
                    }

                    if (errorMessage !== '') {
                        notify.error({
                            title: "",
                            content: errorMessage
                        });
                    }
                    if (!isNavigated) {
                        df.reject(xhr.responseText, data, xhr);
                        if (callback && callback.error) {
                            callback.error(status, xhr);
                        }
                    }
                }
            });
            return df;
        }

        function get(resourceId, url, requestData, callback) {
            defineRequest(resourceId, url, requestData, "GET");
            return sendRequest(resourceId, callback, "GET");
        }

        function post(resourceId, url, requestData, callback) {
            defineRequest(resourceId, url, requestData, "POST");
            return sendRequest(resourceId, callback);
        }

        function put(resourceId, url, requestData, callback) {
            defineRequest(resourceId, url, requestData, "PUT");
            return sendRequest(resourceId, callback);
        }

        function remove(resourceId, url, requestData, callback) {
            defineRequest(resourceId, url, requestData, "DELETE");
            return sendRequest(resourceId, callback);
        }
        function gotoError(errorResponse, httpMethod) {
            errorWatcher.lastError(errorResponse);
            if (errorResponse.responseText) {
                errorWatcher.lastFullErrorInfo($.parseJSON(errorResponse.responseText));
            }
            navigationService.gotoErrorPage(httpMethod);
        }
    }
});
