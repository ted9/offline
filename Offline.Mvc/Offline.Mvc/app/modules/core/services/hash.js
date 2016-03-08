define(function () {
    "use strict";

    var hashFactory = {
        create: create
    };
    return hashFactory;
    /*
    Factory method
    */
    function create() {
        return new Hash();
    }

    /*Definition of List object*/

    function Hash() {
        var items = {};
        var hash = {
            update: update,
            add: add,
            get: get,
            clear: clear,
            load: load,
            toArray: toArray
        };

        return hash;
        /*Private methods*/

        function toArray() {
            var result = [];
            for (var key in items) {
                result.push(items[key]);
            }
            return result;
        }

        function load(key, data) {
            if (!data || data.length <= 0) {
                return;
            }
            for (var index = 0; index < data.length; index++) {
                var dataItem = data[index];
                var keyValue = dataItem[key];
                add(keyValue, dataItem);
            }
        }

        function get(key) {
            return items[key];
        }

        function add(dataKey, data) {
            items[dataKey] = data;
        }

        function update(dataKey, data) {
            add(dataKey, data);
        }

        function clear() {
            items = {};
        }
    }
});
