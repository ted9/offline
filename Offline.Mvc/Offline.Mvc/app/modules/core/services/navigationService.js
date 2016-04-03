define([
    'plugins/router',
    'amplify',
    'dataContext'
], function (router, amplify, context) {
    "use strict";

    var amplifyUrlHashKey = "_UrlHash_";
    var navigation = {
        navigateTo: navigateTo,
        goLogin: goLogin,
        goError: goError,
        storeUrlHash: storeUrlHash,
        getCurrentUrlHashes: getCurrentUrlHashes,
        gotoErrorPage: gotoErrorPage,
        getMenuItems: getMenuItems,
        getModuleInfo: getModuleInfo
    };

    function navigateTo(route, force) {
        force = force ? force : false;
        if (force || !router.isNavigating()) {
            router.navigate(route);
        }
    }
    function getModuleInfo() {
        var eventName = "module.load";
        var params = [];
        params.push({ name: "(rename)", value: "<ArrayOfNameMapping><NameMapping><OldName>table</OldName><NewName>module</NewName></NameMapping><NameMapping><OldName>table1</OldName><NewName>control</NewName></NameMapping><NameMapping><OldName>table2</OldName><NewName>event</NewName></NameMapping><NameMapping><OldName>table3</OldName><NewName>param</NewName></NameMapping></ArrayOfNameMapping>" });
        params.push({ name: "(relation)", value: "<ArrayOfRelMapping><RelMapping><Name>controls</Name><Parent>module.moduleId</Parent><Child>control.moduleId</Child></RelMapping><RelMapping><Name>events</Name><Parent>control.controlId</Parent><Child>event.controlId</Child></RelMapping><RelMapping><Name>eventParams</Name><Parent>event.eventId</Parent><Child>param.eventId</Child></RelMapping></ArrayOfRelMapping>" });
        return context.getInstance().postRequest(eventName, createEvent(eventName, params, "ModuleInfo_GET_P"));
    }

    function getMenuItems() {
        var eventName = "menu.load";
        var params = [];
      //  params.push({ name: "(relation)", value: "<ArrayOfRelMapping><RelMapping><Name>details</Name><Parent>table.menuGroup</Parent><Child>table1.menuGroup</Child></RelMapping></ArrayOfRelMapping>" });
        return context.getInstance().postRequest(eventName, createEvent(eventName, params, "Menu_GET_P"));
    }

    function createEvent(eventName, parameters, functionName) {
        return {
            eventName: eventName,
            functionName: functionName,
            runParams: parameters
        };
    }
    function goError() {
        router.navigate('#/notifyOfError');
    }

    function goHome() {
        navigateTo('');
    }

    function goLogin(force) {
        navigateTo('#/login', force);
    }
    function storeUrlHash() {
        var urlHashes = getCurrentUrlHashes();
        var prevUrlHash = urlHashes.currentHash;
        urlHashes.previousHash = prevUrlHash;
        urlHashes.currentHash = window.location.hash;
        if (urlHashes.currentHash === urlHashes.previousHash) {
            urlHashes.previousHash = "";
        }
        amplify.store(amplifyUrlHashKey, urlHashes);
    }
    function getCurrentUrlHashes() {
        var urlHashes = amplify.store(amplifyUrlHashKey);
        if (_.isUndefined(urlHashes)) {
            urlHashes = {
                currentHash: "#",
                previousHash: "#"
            };
        }
        return urlHashes;
    }
    function gotoErrorPage(httpMethod) {
        var urlHashes = getCurrentUrlHashes();
        if (!httpMethod) {
            httpMethod = "GET";
        }
        var hash = encodeURIComponent(httpMethod === "GET" ?
            urlHashes.previousHash.replace('#', '') : urlHashes.currentHash.replace('#', ''));
        navigateTo('#error/?returnUrl=' + hash, true);
    }
    return navigation;

});
