define([
    'config/appConstants',
   
    'modules/core/helper/sessionStorageHelper'
], function (appConfig, sessionStorageHelper) {
    "use strict";

    var helper = {
        amplifyKey: '_moduleInfo',
        getModuleInfo: getModuleInfo,
        setModuleInfo: setModuleInfo,       
        cleanModuleInfo: cleanModuleInfo
    };
    return helper;

    function cleanModuleInfo() {
        sessionStorageHelper.setItem(helper.amplifyKey, null);
    }

    function getModuleInfo() {
        var data = sessionStorageHelper.getItem(helper.amplifyKey);
        
        return data;
    }

    function setModuleInfo(data) {
      
        sessionStorageHelper.setItem(helper.amplifyKey, data);
    }
});