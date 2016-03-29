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
   
    var vmError = {
        
        activate: activate,
        pageNav: {
                   },
     };
    return vmError;


    function activate(params) {
       
        return true;
    }

   
});