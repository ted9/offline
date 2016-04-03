define([
    'config/appConstants',
   
    'modules/core/helper/sessionStorageHelper'
], function (appConfig, sessionStorageHelper) {
    "use strict";

    var helper = {
        amplifyKey: '_moduleInfo',
        getModuleInfo: getModuleInfo,
        setModuleInfo: setModuleInfo,       
        cleanModuleInfo: cleanModuleInfo,
        getModuleInfoItem: getModuleInfoItem
    };
    return helper;

    function cleanModuleInfo() {
        sessionStorageHelper.setItem(helper.amplifyKey, null);
    }

    function getModuleInfo() {
        var data = sessionStorageHelper.getItem(helper.amplifyKey);
        
        return data;
    }

    function getModuleInfoItem(moduleName) {
        var data = sessionStorageHelper.getItem(helper.amplifyKey);
        var modules = data[0].value.data;
        if (modules && modules instanceof Array) {
            return _.find(modules, function (item) {
                return item.moduleName.toLowerCase() == moduleName.toLowerCase();
            });
        }
        return null;
    }
    
    function setModuleInfo(data) {
      
        sessionStorageHelper.setItem(helper.amplifyKey, data);
    }
});