define([
    'plugins/router',
    'durandal/app',
    'jquery',
    'knockout',
    'config/appConstants',
    'modules/core/services/hash',
    'plugins/history',
    'dataContext',
    'modules/core/helper/userProfileHelper',
    'logger',
    'languageHelper',
    'modules/core/models/enums',
    'config/navPageButtonType',
    'modules/core/helper/deviceHelper'
    //'modules/timesheet/config/urlConfig',
    //'modules/core/helper/uiHelper',
    //'modules/core/models/appSettings',
    //'config/routes/exceptionRoutes',
    //'modules/core/services/navigationService',
    
    //'modules/core/helper/moduleHelper',
    //,
    //'modules/core/helper/tourHelper',
    //'modules/core/services/tour',
    //'modules/core/helper/amtSettingsDbHelper',
    //'modules/core/helper/offlineHelper'
], function (router, app, $, ko, appConfig, hashFactory, history, datacontext, userProfileHelper,
    logger, languageHelper, enums, navPageButtonType, deviceHelper) //, urlConfig,
  //  uiHelper, appSettings, exceptionRoutes, navigationService, moduleHelper, tourHelper, tourService, amtSettingsDbHelper, offlineHelper) {
   {
    "use strict";
    /*properties*/
    var routes = hashFactory.create();
    var leftCommand = ko.observable({
        i18nTextKey: "",
        click: gotoHomePage,
        mobileClick: null,
        type: navPageButtonType.home,
        disable: false,
        id: "",
        callback: null
    });
    var midCommand = ko.observable({
        i18nTextKey: [],
        text: [],
        type: navPageButtonType.none,
        disable: false,
        id: ""
    });
    var rightCommand = ko.observable({
        i18nTextKey: "",
        text: "",
        type: navPageButtonType.none,
        disable: ko.observable(false),
        id: ""
    });
    var activePage = {
        title: ko.observable(),
        titleI18nKey: ko.observable(),
        viewHeader: ko.observable(""),
        onHomeLeftClicked: function () { },
        onHomeRightClicked: function () { },
        rightNavigationCls: ko.observable("logout"),
        leftNavigationCls: ko.observable("glyphicon amtmobile-navigation-back"),
        displayNameHeaderCls: ko.observable(""),
        titleCls: ko.observable(""),
        homeLeftNavigationText: ko.observable(""),
        homeRightNavigationText: ko.observable("")
    };
    var modules = ko.observableArray([]);

    var name = "Default";
    var indexLayout = {
        /*properties*/
        displayName: ko.observable(""),
        activePage: activePage,
        router: router,
        /*Event*/
        activate: activate,
        attached: attached,
        compositionComplete: compositionComplete,
        onPageCommandItemClicked: onPageCommandItemClicked,
        onHomeButtonClick: onHomeButtonClick,
        onBackButtonClick: onBackButtonClick,
        onSwitchLanguageClick: onSwitchLanguageClick,
        onLogoutClick: onLogoutClick,
        onHomeLeftClicked: onHomeLeftClicked,
        onHomeRightClicked: onHomeRightClicked,
        leftCommand: leftCommand,
        midCommand: midCommand,
        rightCommand: rightCommand,
        maxLengthOfPageHeader: 100, //length of page header string,
        onMobileLeftButtonClicked: onMobileLeftButtonClicked,
        onTabletLeftButtonClicked: onTabletLeftButtonClicked
    };
    return indexLayout;
    function onMobileLeftButtonClicked() {
        if (leftCommand().mobileClick) {
            leftCommand().mobileClick();
        }
        else {
            if (leftCommand().click) {
                leftCommand().click();
            }
        }
    }
    function onTabletLeftButtonClicked() {
        if (leftCommand().click) {
            leftCommand().click();
        }
        else {
            gotoHomePage();
        }
    }
    function gotoHomePage() {
        router.navigate("#");
    }

    function activate() {
        //  debugger;
        if (deviceHelper.isMobile()) {
            indexLayout.maxLengthOfPageHeader = 20;
        }
        router.on("router:route:activating", function (instance, instruction, router) {
            logger.info("Tutorial: Destroy tutorial of current page");
            tourHelper.destroy();
        });
        router.on("router:navigation:complete", function (instance, instruction, router) {
            setupNavigation(instance);
            updateDocumentTitle(instruction);
            verifyPermission(instruction);
            logger.info("router:navigation:complete: {0}", instruction);
            navigationService.storeUrlHash(); //store previous & current url hash into localStorage to use in error

            if (window.Select2 && window.Select2.class && window.Select2.class.abstract && window.Select2.class.abstract.prototype && window.Select2.class.abstract.prototype.closeFromRouter) {
                window.Select2.class.abstract.prototype.closeFromRouter();
            }
        });
        router.on("router:navigation:composition-complete", function (instance, instruction, router) {
            //logger.info("Tutorial: Load tutorial for page: {0}", instruction.config.moduleId);
            //tourHelper.load(instruction);
        });
        getAppSettings(function () {
            getUserProfile(function () {
                buildRoutes(function () {
                    registerEventHandlers();

                    if (document.location.hash) {
                        loadAndSetModuleAsActive(function () {
                            router.activate();
                        });
                    }
                    else {
                        router.activate();
                    }
                });
            });
        });
    }

    function loadAndSetModuleAsActive(callback) {
        var url = document.location.hash.replace('#', '');
        var index = url.indexOf('/');
        if (index > 0) {
            var moduleUrl = 'modules/' + url.substring(0, index) + '/index';
            require([moduleUrl], function (moduleInstance) {
                return moduleInstance.start(moduleInstance.options).then(function (module) {
                    logger.info("'{0}' module was initialized", module.name);
                    if (callback) {
                        callback();
                    }
                });
            });
        }
        else {
            if (callback) {
                callback();
            }
        }
    }

    function verifyPermission(instruction) {
        logger.info("authenticated:{0}, url:{1}", userProfileHelper.isEmployeeAuthenticated(), instruction);
        if (instruction.config.authType === enums.authType.employee && !userProfileHelper.isEmployeeAuthenticated()) {
            router.navigate(urlConfig.employeeLogin, { trigger: true, replace: true });
        }
        if (instruction.config.authType === enums.authType.supervisor && !userProfileHelper.isEmployeeAuthenticated()) {
            router.navigate(urlConfig.supervisorLogin, { trigger: true, replace: true });
        }
    }

    function setupNavigation(instance) {
        if (instance && instance.pageNav && instance.pageNav.leftCommand) {
            leftCommand(instance.pageNav.leftCommand);
            logger.info("left command:{0}", leftCommand());
        }
        if (instance && instance.pageNav && instance.pageNav.midCommand) {
            midCommand(instance.pageNav.midCommand);
            logger.info("mid command:{0}", midCommand());
        }
        if (instance && instance.pageNav && instance.pageNav.rightCommand) {
            if (!instance.pageNav.rightCommand.disable) {
                instance.pageNav.rightCommand.disable = ko.observable(false);
            }
            rightCommand(instance.pageNav.rightCommand);
            logger.info("right command:{0}", rightCommand());
        }
        languageHelper.run();
    }

    function updateDocumentTitle(instruction) {
        var moduleName = instruction.config.moduleName;

        if (moduleName) {
            document.title = String.format("{0} | {1}", app.title, moduleName);
        }
        else {
            document.title = app.title;
        }

    }

    function isValidArray(array) {
        if (!_.isArray(array)) return true;
        if (_.isEmpty(array[0])) return false;
        return true;
    }
    function attached(viewHtml) {

    }

    function compositionComplete() { }

    function getAppSettings(callback) {
        //offlineHelper.isOffline().then(function (isOffline) {
        //    if (isOffline) {
        //        return amtSettingsDbHelper.getSetting("appSettings").then(function (data) {
        //            saveAppSettingsObject(data.value);
        //            if (callback) {
        //                callback();
        //            }
        //        });

        //    } else {
                var dataCtx = datacontext.getInstance();
                var url = String.format('{0}/configuration/settings', appConfig.apiUrl);
                return dataCtx.get("configuration_settings", url).then(function (data) {
                    saveAppSettingsObject(data);
                    if (callback) {
                        callback();
                    }
                    amtSettingsDbHelper.saveSetting("appSettings", data);
                });
        //    }
        //});
    }

    function saveAppSettingsObject(data) {
        appSettings.maxRecords = data.maxRecords;
        appSettings.allowImageExtensionsUploading = data.allowImageExtensionsUploading;
        appSettings.allowVideosExtensionsUploading = data.allowVideosExtensionsUploading;
        appSettings.allowOtherExtensionsUploading = data.allowOtherExtensionsUploading;
        appSettings.supportEmail = data.supportEmail;
    }

    function getUserProfile(callback) {
        var userProfile = userProfileHelper.getUserProfile();
        getAccountInfo(userProfile.userId, function (accountInfo) {
            indexLayout.displayName(accountInfo.displayName);
            getUserModules(accountInfo.userId, function (userModules) {
                var userprofile = userProfileHelper.getUserProfile();
                userprofile.logoUrl = accountInfo.logoUrl;
                userprofile.isAuthenticated = accountInfo.isAuthenticated;
                userprofile.username = accountInfo.username;
                userprofile.userId = accountInfo.userId;
                userprofile.displayName = accountInfo.displayName;
                userprofile.modules = [];
                appConfig.userSessionId = accountInfo.sessionId;

                setUserProfile(userprofile, userModules, callback);

            });
        });
    }



    function getAccountInfo(userId, callback) {
        offlineHelper.isOffline().then(function (isOffline) {
            if (isOffline === true) {
                //getAccountinfo offline
                amtSettingsDbHelper.getAccountInfo(userId).then(
                    function (accountInfo) {
                        if (callback) {
                            callback(accountInfo);
                        }
                    });
            } else {
                var dataCtx = datacontext.getInstance();
                var url = String.format('{0}/account', appConfig.apiUrl);
                dataCtx.get("account_get", url).then(function (accountInfo) {
                    //save account info offline
                    amtSettingsDbHelper.saveAccountInfo(accountInfo.userId, accountInfo).then(function () {
                        if (callback) {
                            callback(accountInfo);
                        }
                    });
                });
            }
        });
    }

    function getUserModules(userId, callback) {
        //offlineHelper.isOffline().then(function (isOffline) {
        //    if (isOffline) {
        //        //get usermodules from offline
        //        amtSettingsDbHelper.getUserModules(userId).then(function (userModules) {
        //            if (callback) {
        //                callback(userModules);
        //            }
        //        });
        //    } else {
        //        var dataCtx = datacontext.getInstance();
        //        var url = String.format('{0}/module/moduleconfig/usermodules', appConfig.apiUrl);
        //        dataCtx.get("usermodules_get", url).then(function (data) {
        //            var userModules = data.result || data;
        //            amtSettingsDbHelper.saveUserModules(userId, userModules).then(function () {
        //                console.log('saved usermodules');
        //                if (callback) {
        //                    callback(userModules);
        //                }
        //            });
        //        });
        //    }
        //});


        if (callback) {
                                callback();
                            }
    }

    function setUserProfile(userprofile, userModules, callback) {
        for (var i = 0; i < userModules.length; i++) {
            var moduleItem = moduleHelper.getUserModuleItem(userModules[i]);
            userprofile.modules.push(moduleItem);
        }

        userProfileHelper.setUserProfile(userprofile);
        if (_.isEmpty(tourHelper.getTourStatusFromClientStorage())) {
            tourService.getTourItems().then(function (response) {
                if (!_.isEmpty(response)) {
                    tourHelper.setTourStatusToClientStorage(response);
                }
            });
        }
        if (callback) {
            callback();
        }
    }

    function onPageCommandItemClicked() { }

    function onHomeButtonClick(obj, evt) {
        router.navigate('');
    }

    function onBackButtonClick(obj, evt) {
        history.navigateBack();
    }

    function onSwitchLanguageClick(data, evt) {
        languageHelper.setLanguage(data);

        if (router.activeItem() && router.activeItem().onLanguageChanged) {
            router.activeItem().onLanguageChanged(data);
        }
    }

    function onLogoutClick() {
        userProfileHelper.logout();
    }

    function registerEventHandlers() {
        app.on("page:activated", function (page) {
            setupNavigation(page);
            if (!isTourlessPage(page.pageNav.midCommand.i18nTextKey)) {
                tourHelper.restart();
            }
        });
        logger.info("event was registered");
    }
    function isTourlessPage(i18TextKey) {
        var page = _.find(appConfig.tourlessPages, function (item) {
            return item === i18TextKey;
        });
        return !_.isEmpty(page);
    }
    function loadRegisteredModules() {
        modules(require(appConfig.modules));
    }

    function buildRoutes(callback) {
        var routes = [
            {
                route: '',
                //title: 'Dashboard',
                moduleId: 'layout/dashboard',
                nav: true
            }, {
                route: 'error',
                //title: 'Error',
                moduleId: 'viewmodels/error',
                nav: true
            }, {
                route: 'notfound',
                //title: 'Not Found',
                moduleId: 'viewmodels/notfound',
                nav: true
            }
        ];

        var userprofile = userProfileHelper.getUserProfile();

        onSwitchLanguageClick(userprofile.language);

        var routeConfigUrls = [];
        for (var i = 0; i < userprofile.modules.length; i++) {
            var module = userprofile.modules[i];
            var url = String.format("config/routes/{0}", module.id);
            routeConfigUrls.push(url);
        }

        require(routeConfigUrls, function () {
            for (var i = 0; i < arguments.length; i++) {
                for (var j = 0; j < arguments[i].length; j++) {
                    routes.push(arguments[i][j]);
                }
            }
            router.map(routes)
                .buildNavigationModel()
                .mapUnknownRoutes("viewmodels/error");

            if (callback) {
                callback();
            }
        });
    }

    function onHomeLeftClicked() {
        if (activePage.onHomeLeftClicked) {
            activePage.onHomeLeftClicked();
        } else {
            onBackButtonClick();
        }
    }

    function onHomeRightClicked() {
        if (activePage.onHomeRightClicked) {
            activePage.onHomeRightClicked();
        }
    }

});