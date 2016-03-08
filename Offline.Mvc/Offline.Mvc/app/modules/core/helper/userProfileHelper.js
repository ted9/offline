define([
    'config/appConstants',
    'amplify',
    'modules/core/models/userProfile',
    'modules/core/services/hash',
    'modules/core/helper/sessionStorageHelper'
], function (appConfig, amplify, userProfile, hash, sessionStorageHelper) {
    "use strict";

    var helper = {
        amplifyKey: 'userProfile',
        getUserProfile: getUserProfile,
        setUserProfile: setUserProfile,
        logout: logout,
        clearUserProfile: clearUserProfile,
        clearEmployeeAuthentication: clearEmployeeAuthentication,
        isEmployeeAuthenticated: isEmployeeAuthenticated
    };
    return helper;

    function clearUserProfile() {
        sessionStorageHelper.setItem(helper.amplifyKey, null);
    }

    function getUserProfile() {
        var data = sessionStorageHelper.getItem(helper.amplifyKey);
        $.extend(userProfile, data);
        var moduleSetting = hash.create();
        moduleSetting.load("moduleConfigId", userProfile.modulesSetting);
        userProfile.modulesSetting = moduleSetting;
        return userProfile;
    }

    function setUserProfile(profile) {
        profile.modulesSetting = profile.modulesSetting.toArray ?
            profile.modulesSetting.toArray() : (profile.modulesSetting instanceof Array ?
                profile.modulesSetting : [profile.modulesSetting]);

        //console.log(' profile module load in memory ' + JSON.stringify(profile));
        sessionStorageHelper.setItem(helper.amplifyKey, profile);
    }

    function isEmployeeAuthenticated() {
        var userprofile = getUserProfile();
        return userprofile.employeeId > 0;
    }

    function clearEmployeeAuthentication() {
        var userprofile = getUserProfile();
        userprofile.employeeId = 0;
        userprofile.employeeName = '';
        userprofile.isSupervisor = false;
        userprofile.authToken = '';
        setUserProfile(userprofile);
    }

    function logout() {
        var url = String.format('{0}/account/logoff', appConfig.apiUrl);
        $.ajax({
            type: 'POST',
            dataType: 'text json',
            url: url,
            success: function (response, statusText, xhr) {
                clearUserProfile();
                document.location.href = '';
            },
            complete: function (xhr, statusText, errorThrown) {
            }
        });
    }
});
