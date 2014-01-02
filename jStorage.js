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

// Creating a closure to avoid leaking variables into global scope,
// and using the variable undefined to get a X-browser compatible
// way of comparing with undefined, see this stackoverflow answer:
// http://stackoverflow.com/questions/135448/how-do-i-check-to-see-if-an-object-has-a-property-in-javascript#answer-135568
(function (window, undefined) {
    // Upgrading to EcmaScript 5, and generating more helpful execptions and errors.
    "use strict";

    var jStorage = function (config) {
        // The jStorage object is actually just the init constructor 'enhanced'
        return new jStorage.fn.init(config);
    };
    var error = function (msg) {
        // prepend with our libName to be nice, not everyone has nice debugging tools.
        throw "jStorage: " + msg;
    };
    jStorage.fn = jStorage.prototype = {
        init: function (config) {
            this._provider = false;

            // Do some inital sanity checking of our input.
            if(config === undefined || !config) error("No config, please consult the readme ;)");
            if(config['name'] === undefined) error("No name in config.");

            if (jStorage.providers[config.name]) {
                var provider = jStorage.providers[config.name];
                this._provider = provider;

                // Calling the callback now becomes the provider
                // modules responsibility
                provider.init(this, config);
            } else {
                error('Storage provider ' + config.name + ' was not loaded.');
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

    // Placeholder for our provider modules.
    // Each module will register itself here.
    jStorage.providers = jStorage.prototype = {

    };

    // Give the init function the jStorage prototype for later instantiation
    jStorage.fn.init.prototype = jStorage.fn;

    window.jStorage = jStorage;

}(window));