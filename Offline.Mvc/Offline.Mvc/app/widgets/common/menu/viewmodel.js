define([
    'knockout',
    'plugins/router',
    "modules/core/helper/uiHelper",
    "languageHelper"
], function (ko, router, uiHelper, languageHelper) {
    "use strict";

    var wid = function () {
        this.menuItems = ko.observableArray([]);
        this.getMenuItems = function () { };
        this.activate = onActivate;
        this.onMenuItemClicked = onMenuItemClicked;
        this.cls = "";
        this.compositionComplete = compositionComplete;
    };
    return wid;

    function onMenuItemClicked(menuItem) {
        router.navigate(menuItem.url);
    }

    function compositionComplete() {
        languageHelper.run();
    }

    function onActivate(settings) {
        var self = this;
        uiHelper.extend(self, settings);
        var items = self.getMenuItems();
        //if getItemsMenu return promise
        if (items.then) {
            items.then(function (data) {
                self.menuItems(data);
            });
            //if getItemsMenu return an object. it must be array
        } else {
            self.menuItems(items);
        }

    }
});
