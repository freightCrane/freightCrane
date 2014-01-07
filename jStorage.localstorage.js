(function (jStorage, undefined) {

    jStorage.providers.localstorage = jStorage.providers.prototype = {
        init: function (wrapper, config) {
            var self = this;
            this._config = config;

            // TODO: Verify that browser support localStorage
            // TODO: call the callback function with result

            // check if browser support localStorage AND has all methods we need.
            this.hasLocalStorage = "localStorage" in window
                && "setItem" in window["localStorage"]
                && "getItem" in window["localStorage"]
                && "removeItem" in window["localStorage"]
                && "setItem" in window["localStorage"];

            var callStatus = false;
            if (hasLocalStorage) {
                callStatus = {
                    'isOK': true,
                    'code': 0,
                    'msg': ''
                };
            } else {
                callStatus = {
                    'isOK': false,
                    'code': -1,
                    'msg': 'Browser doesn\'t support localStorage. User might be in "private mode" or have a old browser.'
                };
            }

            if (self._hasCallback) {
                self._config.callback(wrapper, callStatus);
            }
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