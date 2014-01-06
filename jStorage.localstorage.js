(function (jStorage, undefined) {

    jStorage.providers.localstorage = jStorage.providers.prototype = {
        init: function (wrapper, config) {
            var self = this;
            this._config = config;

        },
        get: function (name, callback) {
            var self = this;

        },
        set: function (name, content, callback) {
            var self = this;

        },
        del: function (name, callback) {
            var self = this;

        },
        list: function (name, callback) {
            var self = this;

        },
        exists: function (name, callback) {
            var self = this;

        }
    };
})(jStorage);