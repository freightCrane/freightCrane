/*!
 * freightCrane
 * https://github.com/freightCrane/freightCrane
 *
 * Copyright 2013 Mattias Blomqvist and other contributors
 * Released under the MIT license
 * https://github.com/freightCrane/freightCrane/blob/master/LICENSE
 *
 * Date: 21:09 2013-12-30
 */

// Creating a closure to avoid leaking variables into global scope,
// and using the variable undefined to get a X-browser compatible
// way of comparing with undefined, see this stackoverflow answer:
// http://stackoverflow.com/questions/135448/how-do-i-check-to-see-if-an-object-has-a-property-in-javascript#answer-135568
(function (window, undefined) {
    // Upgrading to EcmaScript 5, and generating more helpful execptions and errors.
    // Even though: http://bugs.jquery.com/ticket/13335, we've decided to go this path
    // for now to write better code. We only test in modern browsers right now. If
    // this bothers you(you use Firefox < 18 and your debug trace crashes it f.x.),
    // poke us and we'll bake a version without it. For now, deal with it, since we
    // don't have any legacy browsers to test with ;)
    "use strict";

    var freightCrane = function (config) {
        // The freightCrane object is actually just the init constructor 'enhanced'
        return new freightCrane.fn.init(config);
    };
    var error = function (msg) {
        // prepend with our libName to be nice, not everyone has nice debugging tools.
        throw "freightCrane: " + msg;
    };
    freightCrane.fn = freightCrane.prototype = {
        init: function (config) {
            this._provider = false;

            // Do some inital sanity checking of our input.
            if(config === undefined || !config) error("No config, please consult the readme ;)");
            if(config.name === undefined) error("No name in config.");

            if (freightCrane.providers[config.name]) {
                var provider = freightCrane.providers[config.name];
                this._provider = provider;

                // Calling the callback now becomes the provider
                // modules responsibility
                provider.init(this, config);
            } else {
                error('Storage provider "' + config.name + '" was not loaded.');
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
        move: function (currentName, newName, callback) {
        	if (this._provider) {
        		this._provider.move(currentName, newName, callback);
        	}
        },
        del: function (name, callback) {
            if (this._provider) {
                this._provider.del(name, callback);
            }
        },
        listStorages: function (callback) {
            if (this._provider) {
                this._provider.listStorages(callback);
            }            
        },
        list: function (name, callback) {
            if (this._provider) {
                this._provider.list(name, callback);
            }
        },
        exists: function (name, callback) {
            if (this._provider) {
                this._provider.exists(name, callback);
            }
        }
    };

    // Placeholder for our provider modules.
    // Each module will register itself here.
    freightCrane.providers = {

    };

    // Give the init function the freightCrane prototype for later instantiation
    freightCrane.fn.init.prototype = freightCrane.fn;

    window.freightCrane = freightCrane;

}(window));
