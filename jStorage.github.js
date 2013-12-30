(function (jStorage, undefined) {
    jStorage.providers.github = jStorage.providers.prototype = {
        init: function () {
            console.log('github init');
        },
        get: function () {
            console.log('github get');
        },
        set: function () {
            console.log('github set');
        },
        del: function () {
            console.log('github del');
        },
        list: function () {
            console.log('github list');
        },
        exists: function () {
            console.log('github exists');
        }
    };
})(jStorage);