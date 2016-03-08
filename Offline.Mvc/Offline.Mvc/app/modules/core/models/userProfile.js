define([
    "modules/core/services/hash"
], function (hash) {
    "use strict";

    var modulesSetting = hash.create();

    var userProfile = {
        deviceInfo: {},
        isAuthenticated: false,
        logoUrl: '',
        username: '',
        displayName: '',
        //modules: [],
        //selectedModuleTourStatus: {},
        //modulesSetting: modulesSetting,
        //employeeId: 0,
        //employeeName: '',
        //isSupervisor: false,
        //authToken: '',
        //siteId: 0,
        //siteName: '',
        //assetId: 0,
        //assetName: "",
        //isRecordingMeasurement: false,
        //selectedMeasurement: {},
        //isRecordingUsage: false,
        //selectedUsage: {},
        //isRecordingInpectionMeasurement: false,
        //selectedInspectionMeasurement: {},
        //selectedCustomer: {},
        //selectedFleet: {
        //    fleetId: '',
        //    fleet: ''
        //},
        //assetPerformanceFilterInfo: {
        //    selectedFleets: [],
        //    selectedAssets: [],
        //    startDate: ""
        //}

    };
    return userProfile;
});
