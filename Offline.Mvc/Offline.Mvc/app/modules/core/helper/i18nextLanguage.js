define([
    'jquery',
    'durandal/binder',
    'i18n',
    'config/appConstants',
    'modules/core/models/enums'
], function ($, binder, i18n, appConfig, enums) {
    "use strict";

    var i18NOptions = {
        lng: 'en',// appConfig.languageIsoCode,
        fallbackLng: false,
        ns: {
            namespaces: ['common', 'amtLogin', 'widget', 'timesheet', 'workbench', 'supervisor', 'setting', 'inspections', 'customers', 'quoter', 'administrator', 'fleetStatistics', 'offline'],
            defaultNs: 'common'
        },
        load: 'current',//This will help you optimizing the loading behaviour. In combination with setting fallbackLng to false you can reduce the requests to the server to one!
        useCookie: true,
        // cookieName: 'i18next',
        useLocalStorage: true,// appConfig.runMode === enums.appRunMode.release,
        localStorageExpirationTime: 1800000,
        getAsync: false,
        resGetPath: 'app/locales/__lng__/__ns__.txt',//?v=' + window.APP_VERSION,
        resPostPath: 'app/locales/__lng__/__ns__.txt'//?v=' + window.APP_VERSION
    };
    var language = {
        run: run,
        init: init,
        update: update,
        setLanguage: setLanguage,
        getString: getString
    };
    return language;

    function run(view) {
        $.i18n.init(i18NOptions, function () {
            $(view || document).i18n();
        });
    }

    function init() {
        $.i18n.init(i18NOptions, function () {
            binder.binding = function (obj, view) {
                $(view).i18n();
            };
        });
    }

    function update(view) {
        $(view || document).i18n();
    }

    function setLanguage(lang) {
        var options = {
            lng: lang
        };
        $.i18n.setLng(lang, options);
        //debugger;
        run();
    }

    function getString(key, namespace, isFullKey) {
        if (isFullKey) {
            return $.i18n.t(key);
        }
        if (!String.isNullOrWhiteSpace(namespace)) {
            return $.i18n.t(namespace + ":" + key);
        } else {
            return $.i18n.t("common:" + key);
        }
    }
});
