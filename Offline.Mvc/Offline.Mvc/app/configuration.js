define([
    "jquery",
  //  "config/aliasConfig",    
    'modules/core/helper/userProfileHelper',
    'config/appConstants',
  //  'modules/core/services/module',
    'jqueryMigrate'
], function ($, userProfileHelper, appConfig, /*moduleService,*/ jqueryMigrate, aliasConfig) {

    "use strict";

    var configManager = {
        config: config
    };
    return configManager;

    function config() {
        ajaxSetupTimeout();
        //configAlias();
        configDevice();
        configTouchBehavior();
    }

    function ajaxSetupTimeout() {
        $.ajaxSetup({
            timeout: appConfig.timeout
        });
    }

    function configDevice() {
        var userProfile = userProfileHelper.getUserProfile();
        //deviceInfo returned from MVC controller. cehck in index.cshtml
        userProfile.deviceInfo = deviceInfo;
        userProfileHelper.setUserProfile(userProfile);
    }

    function configAlias() {
        requirejs.config(aliasConfig);

    }
    function configTouchBehavior() {

        if ($.browser && $.browser.safari) {
            document.addEventListener('touchstart', function (e) {
                e.stopPropagation();
                //e.preventDefault();
                var element = $(e.target);

                if ($(element).parents(".typeahead") && $(element).parents(".typeahead").length > 0) {
                    ($(element).parents(".typeahead")).children("li").removeClass('active');

                    $(element).parents("li").addClass('active');
                    $($(element).parents(".typeahead")[0]).click();
                    $($(element).parents(".dialog-backdrop")).modal("show");
                }
                return true;
            }, false);
        }
    }
});
