define([
    'durandal/app',
    'plugins/widget',
    'knockout',
    'config/appConstants',
    'modules/core/services/hash',
    'modules/core/helper/uiHelper',
    'logger',
    'modules/core/helper/userProfileHelper',
    'modules/core/helper/deviceHelper',
    'languageHelper',
    'config/navPageButtonType',
    //'modules/core/helper/tourHelper',
    //'modules/core/helper/offlineHelper',
    //'modules/core/helper/amtSettingsDbHelper'
], function (app, widget, ko, config, hashFactory, uiHelper, logger, userProfileHelper,
    deviceHelper, languageHelper, navPageButtonType) {//, tourHelper, offlineHelper, SettingsDbHelper) {
    var keepModuleItem;
    var userProfile = {};


    var pageModel = {
        logoUrl: ko.observable(""),
        displayName: ko.observable(""),
        modules: ko.observableArray([]),
        activate: activate,
        onIconClick: onIconClick,
        jcarouselItems: ko.observableArray([]),
        isOffline: ko.observable()
    };

    return pageModel;

    function activate() {
        userProfileHelper.clearEmployeeAuthentication();
        userProfile = userProfileHelper.getUserProfile();
        pageModel.logoUrl(userProfile.logoUrl);
        pageModel.displayName(userProfile.displayName);

        //pageModel.offlineLabel(OfflineUI());

        pageModel.pageNav = {
            leftCommand: { i18nTextKey: 'common:string.empty', text: '', type: navPageButtonType.none },
            midCommand: { i18nTextKey: 'common:moduleNames.dashboard', text: '', type: navPageButtonType.none },
            rightCommand: { i18nTextKey: 'common:string.empty', text: '', type: navPageButtonType.none }
        };
        if (deviceHelper.isMobile()) {
            pageModel.pageNav.midCommand = { i18nTextKey: 'common:string.empty', text: '', type: navPageButtonType.amtLogo };
        }

        //return offlineHelper.isOffline().then(function (isOffline) {
        //    console.log('isOffline: ' + isOffline);

        //    pageModel.isOffline(isOffline);

        //    if (isOffline === true) {

        //        var modulesOffline = [];
        //        var offlineModulesName = ['offlineOptions', 'inspections', 'about'];

        //        userProfile.modules.forEach(function (item) {
        //            if ($.inArray(item.id, offlineModulesName) >= 0) {
        //                modulesOffline.push(item);
        //            }
        //        });

        //        console.log('Offline modules');
        //        console.log(modulesOffline);
        //        pageModel.jcarouselItems(modulesOffline);


        //        //SettingsDbHelper.getUserModules().then(function (items) {

        //        //    items[0].modules.forEach(function (item) {
        //        //        if ($.inArray(item.name , offlineModulesName )>= 0) {
        //        //             modulesOffline.push(item);
        //        //        }
        //        //    });
        //        //});

        //    } else {
        //        console.log('User profile modules');
        //        console.log(userProfile.modules);
        //        pageModel.jcarouselItems(userProfile.modules);
        //    }


        //    //ko.cleanNode(document.getElementById("carousel"));
        //    //ko.applyBindings(pageModel, document.getElementById("carousel"));

        //    $(".popover").hide();
        //    $(".logo").removeClass("tour-hightlight");
        //});
    }

    function loadAndSetModuleAsActive(instanceOf, options) {
        require([instanceOf], function (moduleInstance) {
            return moduleInstance.start(options).then(function (module) {
                logger.info("'{0}' module was initialized", module.name);
            });
        });
    }

    function onIconClick(data, e) {
        tourHelper.tourStepStatus = [];

        if (data.instanceOf) {
            loadAndSetModuleAsActive(data.instanceOf, data.options);
        }
        return false;
    }
});
