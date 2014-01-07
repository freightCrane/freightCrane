(function (jStorage, undefined) {

    jStorage.providers.localstorage = jStorage.providers.prototype = {
        init: function (wrapper, config) {
            var self = this;
            this._config = config;
            this._hasCallback = config && typeof (config.callback) === "function";

            // Verifying that browser support localStorage
            // check if browser support localStorage AND has all methods we need.
            this._hasLocalStorage = "localStorage" in window
                && "setItem" in window["localStorage"]
                && "getItem" in window["localStorage"]
                && "removeItem" in window["localStorage"]
                && "setItem" in window["localStorage"];

            var callStatus = false;
            if (this._hasLocalStorage) {
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
            var hasCallback = typeof (callback) === "function";
            var content = window.localStorage.getItem(name);

            var obj = {
                'name': name,
                'size': content.length,
                'mime-type': 'text/plain',
                'modified': new Date(),
                'data': content
            };
            var callStatus = {
                'isOK': true,
                'code': 0,
                'msg': ''
            };

            // TODO: Only return successfull call if browser supports localStorage.
            if (hasCallback) {
                callback(obj, callStatus);
            }
        },
        set: function (name, content, callback) {
            var self = this;
            var hasCallback = typeof (callback) === "function";

            window.localStorage.setItem(name, content);

            var obj = {
                'name': name,
                'size': content ? content.length : 0,
                'mime-type': 'plain/text',
                'modified': new Date()
            };
            var callStatus = {
                'isOK': true,
                'code': 0,
                'msg': ''
            };

            // TODO: Only return successfull call if browser supports localStorage.
            if (hasCallback) {
                callback(obj, callStatus);
            }
        },
        del: function (name, callback) {
            var self = this;
            var hasCallback = typeof (callback) === "function";

            window.localStorage.removeItem(name);

            var callStatus = {
                'isOK': true,
                'code': 0,
                'msg': ''
            };

            // TODO: Only return successfull call if browser supports localStorage.
            if (hasCallback) {
                callback(callStatus);
            }
        },
        list: function (name, callback) {
            var self = this;
            var hasCallback = typeof (callback) === "function";

            var lists = [];

            // logic to see if key is in "virtual" folder and then return it if is..
            for (var key in window.localStorage) {
                if (key.indexOf(name) == 0) {
                    // TODO: set size value
                    lists.push({
                        'name': key,
                        'size': 0,
                        'mime-type': 'plain/text',
                        'modified': new Date()
                    });
                }
            }

            var callStatus = {
                'isOK': true,
                'code': 0,
                'msg': ''
            };

            // TODO: Only return successfull call if browser supports localStorage.
            if (hasCallback) {
                callback(lists, callStatus);
            }
        },
        exists: function (name, callback) {
            var self = this;
            var hasCallback = typeof (callback) === "function";

            var exists = name in window.localStorage;

            // TODO: Only return successfull call if browser supports localStorage.
            var callStatus = {
                'isOK': true,
                'code': 0,
                'msg': ''
            };

            if (hasCallback) {
                // File exists
                callback(exists, callStatus);
            }
        }
    };
})(jStorage);