(function (jStorage, undefined) {
    jStorage.providers.github = jStorage.providers.prototype = {
        init: function (wrapper, config) {
            console.log('github init');
        },
        get: function (name, callback) {
            console.log('github get');
        },
        set: function (name, content, callback) {
            console.log('github set');
        },
        del: function (name, callback) {
            console.log('github del');
        },
        list: function (name, callback) {
            console.log('github list');
        },
        exists: function (name, callback) {
            console.log('github exists');
        }
    };
})(jStorage);