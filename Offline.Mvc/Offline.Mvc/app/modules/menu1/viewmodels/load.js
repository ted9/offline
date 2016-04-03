define(['plugins/router','knockout',
        'modules/core/helper/moduleInfoHelper'], function (router,ko, moduleHelper) {
    var wid = {
        activate: activate,
        controls: ko.observableArray([]),
        onLeftNavigateClicked: function () { },
        getPageHeading: function () { },
        onCancelClicked: function () { },
        saveDefectItem: function () { },
        isDisableSaveButton: ko.observable(),
        getControlEvent: getControlEvent


    };
    
    wid["name"] = ko.observable("name2");
    wid["id"] = ko.observable(300);
    var moduleName = router.activeInstruction().config.moduleName;
    var moduleInfo = moduleHelper.getModuleInfoItem(moduleName);
    wid.controls(moduleInfo.controls);
    createDataModel(moduleInfo, wid);

    return wid;

    function activate() {

    }

    function createDataModel(moduleInfo, wid) {
        
        var controls = moduleInfo.controls;
        if (controls){
            _.each(controls, function (item) {
                if(!wid[item.fieldName]) 
                    wid[item.fieldName] = ko.observable("test");
                wid[item.fieldName+'_text'] = ko.observable("ok");

                });
        }
    }
    
    function findControlEvent(events, eventName) {
         if (!events) return null;
        var event = events[0];
        if (eventName)
        {
            event = _.find(events, function (item) {
                return item.eventName.toLowerCase() === eventName.toLowerCase();
            });
        }
        return event;
    }

    function getControlEvent(events) {
        if (events) {
            var controlEvent = findControlEvent(events);
            if (controlEvent)
                populateParameters(controlEvent);
            return controlEvent;
        }
        return null;
    }

    function populateParameters(event) {
        event.runParams = [];
        _.each(event.eventParams, function (param) {
            var controlId = param.sourceId;
            var control = getControlById(controlId);
            event.runParams.push({ name: param.name, value: wid[control.fieldName]() })
         //   param.value = wid[control.fieldName]();
        });
    }

    function getControlById(controlId) {
        return _.find(moduleInfo.controls, function (item) {
            return item.controlId === controlId;
        });
    }
    function getDefaultValue(controlInfo) {
        return controlInfo.defaultValue;
    }

});