﻿define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'config/app.config', 'modules/core/services/navigationService',
        'modules/core/helper/custombinding.helper', 'configurationManager', 'durandal/binder', 'languageHelper',
        'modules/core/helper/logger/errorWatcher', 'modules/core/helper/userProfileHelper',
        'plugins/dialog', 'plugins/widget', 'transitions/entrance', 'jqueryte', 'jqueryForm', 'jqueryTruncate',
        'amplify', 'moment', 'typeahead', 'datetimepicker', 'timepicker', 'select2'
],
    function (system, app, viewLocator, appConfig, navService, customBindingHelper, configManager, binder, languageHelper, errorWatcher, userProfileHelper) {
        "use strict";

        system.debug(true);
        
        app.title = appConfig.title;
        
        app.configurePlugin({
            router: true,
            dialog: true,
            widget: true
        });

        configManager.config();
        require(['viewmodels/error', 'text!views/error.html'], function () { });

        app.start().then(function () {
            languageHelper.init();
            errorWatcher.init();
            viewLocator.useConvention();
            customBindingHelper.registerCustomBinding();

            var userProfile = userProfileHelper.getUserProfile();
            app.setRoot("layout/index");            
        });
    }
);