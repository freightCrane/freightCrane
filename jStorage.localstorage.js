(function (jStorage, undefined) {

    jStorage.providers.localstorage = {
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
	            try {
		            self._config.callback(wrapper, callStatus);
	            } catch (e) {
		            // TODO: handle error
	            }
            }
	    },
        get: function (name, callback) {
            var self = this;
            var hasCallback = typeof (callback) === "function";
            var content = window.localStorage.getItem(name);

            var obj = {
                'name': name,
                'size': content ? content.length : 0,
                'mime-type': 'text/plain',
                'modified': new Date(),
                'data': content
            };
            var callStatus = {
                'isOK': content != null ? true : false,
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

        	// logic to see if key is in "virtual" folder and then return it if is..
	        var found = false;
            for (var key in window.localStorage) {
            	if (key.indexOf(name) == 0) {
            		window.localStorage.removeItem(key);
		            found = true;
	            }
            }


            var callStatus = {
                'isOK': found,
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

	        var keys = {};
	        // logic to see if key is in "virtual" folder and then return it if is..
            for (var key in window.localStorage) {
            	if (key.indexOf(name) == 0) {
		            var tmp = key.replace(name, '');
            		var tmpIndex = tmp.indexOf('/');
					// Remove leading slash 
					if (tmpIndex == 0) {
						tmp = tmp.substr(1);
						tmpIndex = tmp.indexOf('/');
					}

					// This is a subfolder...
					if (tmpIndex > 0) {
						tmp = tmp.substr(0, tmpIndex);
					}

					var fullname = name + tmp;

					// Make sure subfolders are only added once
					if (!(tmp in keys)) {
						var size = localStorage.getItem(fullname).length;

			            lists.push({
			            	'path': fullname,
							'name': tmp,
				            'size': size,
				            'mime-type': 'plain/text',
				            'modified': new Date()
			            });
			            keys[tmp] = true;
		            }
	            }
            }

            var callStatus = {
                'isOK': lists.length ? true : false,
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