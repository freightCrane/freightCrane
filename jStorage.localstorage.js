(function (jStorage, undefined) {

    jStorage.providers.localstorage = jStorage.providers.prototype = {
        init: function (wrapper, config) {
            var self = this;
            this._config = config;

            // TODO: Verify that browser support localStorage
            // TODO: call the callback function with result
        },
        get: function (name, callback) {
            var self = this;
            var content = window.localStorage.getItem(name);

            // TODO: call the callback function with result
        },
        set: function (name, content, callback) {
            var self = this;

            window.localStorage.setItem(name, content);

            // TODO: call the callback function with result
        },
        del: function (name, callback) {
            var self = this;

            window.localStorage.removeItem(name);

            // TODO: call the callback function with result
        },
        list: function (name, callback) {
            var self = this;

            // TODO: Add logic to see if key is in "virtual" folder and then return it if it is..
            for (var key in window.localStorage) {
                //console.log(key);
            }

            // TODO: call the callback function with result
        },
        exists: function (name, callback) {
            var self = this;

            var exists = name in window.localStorage;
            // TODO: call the callback function with result
        }
    };
})(jStorage);