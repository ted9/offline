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
        getMenuItems: getMenuItems
    };

    function navigateTo(route, force) {
        force = force ? force : false;
        if (force || !router.isNavigating()) {
            router.navigate(route);
        }
    }

    function getMenuItems() {
        var eventName = "menu.load";
        var params = [];
        params.push({ name: "(relation)", value: "<ArrayOfRelMapping><RelMapping><Name>details</Name><Parent>table.menuGroup</Parent><Child>table1.menuGroup</Child></RelMapping></ArrayOfRelMapping>" });
        //params.push({ name: "test", value: 1 });
        //    params.push({ name: '(rename)', value: '<RelMapping><name>details</name><parent>table.menuGroup</parent><child>table1.menuGroup></child></RelMapping>' })
        return context.getInstance().postRequest(eventName, createEvent(eventName, params));
    }

    function createEvent(eventName, parameters) {
        return {
            eventName: eventName,
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
