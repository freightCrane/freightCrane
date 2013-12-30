(function (jStorage, undefined) {
    jStorage.providers.dropbox = jStorage.providers.prototype = {
        init: function () {
            console.log('dropbox init');
        },
        get: function () {
            console.log('dropbox get');
        },
        set: function () {
            console.log('dropbox set');
        },
        del: function () {
            console.log('dropbox del');
        },
        list: function () {
            console.log('dropbox list');
        },
        exists: function () {
            console.log('dropbox exists');
        }
    };
})(jStorage);