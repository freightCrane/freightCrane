/*!
 * jStorage
 * https://github.com/flowertwig-org/jStorage
 *
 * Copyright 2013 Mattias Blomqvist and other contributors
 * Released under the MIT license
 * https://github.com/flowertwig-org/jStorage/blob/master/LICENSE
 *
 * Date: 21:09 2013-12-30
 */
(function (window, undefined) {
    var rootjStorage;
    var jStorage = function (storageName, callback) {
        // The jStorage object is actually just the init constructor 'enhanced'
        return new jStorage.fn.init(storageName, callback, rootjStorage);
    };
    jStorage.fn = jStorage.prototype = {
        init: function (config) {
            this._provider = false;

            // TODO: do a config and config.name check..

            if (jStorage.providers[config.name]) {
                var provider = jStorage.providers[config.name];
                this._provider = provider;
                provider.init(this, config);
            } else {
                //console.log('Storage provider ' + config.name + ' was not loaded.');
                throw 'Storage provider ' + config.name + ' was not loaded.';
            }
        },
        get: function (name, callback) {
            if (this._provider) {
                this._provider.get(name, callback);
            }
        },
        set: function(name, content, callback) {
            if (this._provider) {
                this._provider.set(name, content, callback);
            }
        },
        del: function (name, callback) {
            if (this._provider) {
                this._provider.del(name, callback);
            }
        },
        list: function (name, callback) {
            if (this._provider) {
                this._provider.list(name, callback);
            }
        },
        exists: function (name, callback) {
            //console.log('exists');
            if (this._provider) {
                this._provider.exists();
            }
        }
    };

    jStorage.providers = jStorage.prototype = {

    };

    // Give the init function the jStorage prototype for later instantiation
    jStorage.fn.init.prototype = jStorage.fn;

    rootjStorage = jStorage;
    window.jStorage = jStorage;

}(window));