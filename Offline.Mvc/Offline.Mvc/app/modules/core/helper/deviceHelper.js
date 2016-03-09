define([
    'jquery',
    'config/appConstants',
    'modules/core/helper/userProfileHelper',
    'jqueryMigrate'
], function ($, appConfig, userProfileHelper) {

    "use strict";
    var deviceType = {
        desktop: 'Desktop',
        mobile: 'Mobile',
        tablet: 'Tablet'
    };

    return {
        isMobile: isMobile,
        isSafariBrowser: isSafariBrowser
    };

    function isMobile() {

        var userProfile = userProfileHelper.getUserProfile();
        //return userProfile.deviceInfo.type === deviceType.mobile;
        return userProfile.deviceInfo.width <= appConfig.maxMobileWidth;
    }
    function isSafariBrowser() {
        return ($.browser && $.browser.safari);
    }
});
