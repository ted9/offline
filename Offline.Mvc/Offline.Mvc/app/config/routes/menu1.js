define([], function () {
    var routes = [
        {
            route: "menu1/menu1items",
            title: "Select Customer",
            moduleName: "menu1Items",
            moduleId: "modules/customers/viewmodels/selectCustomer"
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