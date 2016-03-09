define(["modules/core/helper/deviceHelper"], function (deviceHelper) {
    "use strict";
    var navButtons = {
        none: "",
        "default": "btn btn-default",
        primary: "btn btn-primary",
        home: deviceHelper.isMobile() ? "glyphicon amtmobile-navigation-back" : "logo",
        hidden: "hidden",
        back: "glyphicon amtmobile-navigation-back",
        amtLogo: "logo"
    };
    return navButtons;
});
