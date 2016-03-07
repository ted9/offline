requirejs.config({
    //urlArgs: 'v=' + window.APP_VERSION,
    catchError: {
        define: true
    },
    paths: {
        'text': 'lib/require/text',
        'durandal': 'lib/durandal/js',
        'plugins': 'lib/durandal/js/plugins',
        'transitions': 'lib/durandal/js/transitions',
        'knockout': 'lib/knockout/knockout-2.3.0.debug',
        'komap': 'lib/knockout/knockout.mapping-2.4.1',
        'bootstrap': 'lib/bootstrap/js/bootstrap',
        'jquery': 'lib/jquery/2.1/jquery-2.1.0.min',
        'jqueryNumber': 'lib/jquery/jquery.number.min',
        'jqueryMigrate': 'lib/jquery/jquery-migrate-1.2.1',
        'jqueryte': 'lib/jquery/jquery-te-1.4.0.min',
        'jqueryForm': 'lib/jquery/jquery.form',
        'jqueryTruncate': 'lib/jquery/jquery.dotdotdot.min',
        'amplify': 'lib/amplify.min',
        'toastr': 'lib/toastr/js/toastr.min',
        'moment': 'lib/moment.min',
        'i18n': 'lib/i18next-1.7.1',
        'typeahead': 'lib/biggora-bootstrap-ajax-typeahead/bootstrap-typeahead',
        'datetimepicker': 'lib/datetimepicker/js/bootstrap-datetimepicker',
        'timepicker': 'lib/timepicker/js/bootstrap-timepicker',
        'select2': 'lib/select2/js/select2',
        /*Application shortcut*/
        'config': './config',
        'module': './module',
        'layout': './layout',
        'application': './',
        'dataContext': 'modules/core/dataservices/amplifyDataContext',
        'userProfile': 'modules/core/models/userProfile',
        'enums': 'modules/core/models/enums',
        'logger': 'modules/core/helper/logger/defaultLogger',
        'notifyLogger': 'modules/core/helper/logger/toasterLogger',
        'uiHelper': 'modules/core/helper/uiHelper',
        'languageHelper': 'modules/core/helper/i18nextLanguage',
        'urlConfig': 'modules/timesheet/config/urlConfig',
        'numberHelper': 'modules/core/helper/numberHelper',
        'DBHelper': 'modules/core/helper/indexedDbHelper',
        'amtSettingsHelper': 'modules/core/helper/amtSettingsDbHelper',
        'moxie': 'lib/plupload/moxie',
        'plupload': 'lib/plupload/plupload.dev'
        //'userProfileHelper': 'modules/core/helper/userProfileHelper'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        'amplify': {
            deps: ['jquery'],
            exports: 'amplify'
        },
        'typeahead': {
            deps: ['jquery'],
            exports: 'typeahead'
        },
        'datetimepicker': {
            deps: ['jquery'],
            exports: 'datetimepicker'
        },
        'timepicker': {
            deps: ['jquery'],
            exports: 'timepicker'
        },
        'select2': {
            deps: ['jquery'],
            exports: 'select2'
        },
        'notifyLogger': {
            deps: ['jquery', 'toastr'],
            exports: 'notifyLogger'
        },
        'languageHelper': {
            deps: ['jquery', 'i18n'],
            exports: 'languageHelper'
        },
        'numberHelper': {
            deps: ['jquery', 'jqueryNumber'],
            exports: 'numberHelper'
        },
        'jqueryMigrate': {
            deps: ['jquery'],
            exports: 'jqueryMigrate'
        },
        'jqueryForm': {
            deps: ['jquery'],
            exports: 'jqueryForm'
        },
        'jqueryTruncate': {
            deps: ['jquery'],
            exports: 'jqueryTruncate'
        },
        'moxie': {
            deps: [],
            exports: 'moxie'
        },
        'plupload': {
            deps: ['moxie'],
            exports: 'plupload'
        }
    }
});

define('jquery', function () {
    return jQuery;
});

define('amplify', function () {
    amplify.request.decoders._default = function (data, status, xhr, success, error) {
        if (status == "success") {
            success(data, xhr);
        } else if (status === "fail" || status === "error") {
            error(data, xhr);
        } else {
            error(data, xhr);
        }
    };
    return amplify;
});

define('underscore', [], function () {
    return root._;
});