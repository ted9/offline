define([
    'config/appConstants',

    'modules/core/helper/sessionStorageHelper'
], function (appConfig, sessionStorageHelper) {
    "use strict";

    var helper = {
        amplifyKey: '_menuItems',
        getMenuItems: getMenuItems,
        setMenuItems: setMenuItems,
        cleanMenuItems: cleanMenuItems
    };
    return helper;

    function cleanMenuItems() {
        sessionStorageHelper.setItem(helper.amplifyKey, null);
    }

    function getMenuItems() {
        var data = sessionStorageHelper.getItem(helper.amplifyKey);

        return data;
    }

    function setMenuItems(data) {

        sessionStorageHelper.setItem(helper.amplifyKey, data);
    }
});