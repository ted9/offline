define([], function () {
    var routes = [
        {
            route: "menu1",
            title: "Select Customer",
            moduleName: "load",
            moduleId: "modules/menu1/viewmodels/load"
        },
         {
             route: "menu1/menu11items",
             title: "Select Customer",
             moduleName: "menu111Items",
             moduleId: "modules/customers/viewmodels/select1Customer"
         }
    ];
    return routes;
});