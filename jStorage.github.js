(function (jStorage, undefined) {
    function writeCookie(name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        }
        else var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function eraseCookie(name) {
        writeCookie(name, "", -1);
    }

    function githubRequest(method, address, token, data, callback) {
        var xmlhttp;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.dataType = "json";

        xmlhttp.open(method, address, true);

        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status >= 200 && this.status < 300 || this.status === 304) {
                    var responseData = this.responseText ? JSON.parse(this.responseText) : {};
                    responseData['last-modified'] = this.getResponseHeader("Last-Modified");
                    callback(null, responseData, this);
                } else {
                    // This is a special for get directory calls...
                    if (this.status == 0 && address.indexOf('/contents/') > 0) {
                        callback(null, [], this);
                    }

                    callback({
                        path: address,
                        request: this,
                        error: this.status,
                    });
                }
            }
        };


        //xmlhttp.setRequestHeader('Accept', 'application/vnd.github.raw+json');
        xmlhttp.setRequestHeader('Accept', 'application/json;charset=UTF-8');
        xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        //xmlhttp.setRequestHeader("Access-Control-Allow-Origin", window.location.protocol + '//' + window.location.host);
        //xmlhttp.setRequestHeader('Content-Type', 'application/xml');
        if (token) {
            xmlhttp.setRequestHeader('Authorization', 'token ' + token);
        }

        data ? xmlhttp.send(JSON.stringify(data)) : xmlhttp.send();
    }



    jStorage.providers.github = {
        init: function (wrapper, config) {
            var self = this;

            console.log('github init');

            this._config = config;
            this._hasCallback = config && typeof (config.callback) === "function";
            this._state = 'random' + new Date().getTime();
            this._code = false;
            this._shaCache = {};

            this.ensureAuth(wrapper, config);

            // https://github.com/settings/tokens/new
            var token = this._config.token;

            this._hasRepo = config && typeof (config.repo) === "string";
            this._hasToken = config && typeof (config.token) === "string";

            var callStatus = false;
            if (this._hasRepo && this._hasToken) {
                callStatus = {
                    'isOK': true,
                    'code': 0,
                    'msg': ''
                };
            } else {
                var msg = '';
                if (!this._hasToken) {
                    msg += 'No user token specified. ';
                }
                if (!this._hasRepo) {
                    msg += 'No repository specified. ';
                }
                callStatus = {
                    'isOK': false,
                    'code': -1,
                    'msg': msg
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

            // Remove begining slash
            if (name && name.indexOf('/') == 0) {
                name = name.substring(1);
            }

            // Remove ending slash
            if (name && name[name.length - 1] == '/') {
                name = name.substring(0, name.length - 1);
            }

            addr = "https://api.github.com/repos/" + this._config.repo + "/contents/" + name;
            githubRequest("GET", addr, self._config.token, false, function () {
                console.log('GET', arguments);
                if (arguments.length >= 2) {
                    var info = arguments[1];
                    if ('length' in info) {
                        for (var i = 0; i < info.length; i++) {
                            self._shaCache[info[i].path] = info[i].sha;
                        }
                        callback(null, { 'isOK': false, 'msg': 'this is a directory', 'code': -2 });
                    }
                    else if (info.type == "file") {
                        var data = arguments[1].content;
                        
                        if (data && data.indexOf('\n') !== -1){
                            // Fixing data format returned by github as atob doesn't know what todo with newlines.
                            data = data.replace(/\n/g, '');
                        }
                        
                        self._shaCache[name] = info.sha;
                        callback(
                            {
                                'name': info.path,
                                'size': info.size,
                                'mime-type': 'text/html',
                                'modified': info['last-modified'],
                                'data': atob(data)
                            },
                            { 'isOK': true, 'msg': '', 'code': 0 });
                    } else {
                        callback(null, { 'isOK': false, 'msg': 'This is not a valid file', 'code': -1 });
                    }
                } else {
                    callback(null, { 'isOK': false, 'msg': arguments[0].request.statusText, 'code': arguments[0].request.status });
                }
            });
        },
        set: function (name, content, callback) {
            var self = this;

            // Remove begining slash
            if (name && name.indexOf('/') == 0) {
                name = name.substring(1);
            }

            // Remove ending slash
            if (name && name[name.length - 1] == '/') {
                name = name.substring(0, name.length - 1);
            }

            // update content of file
            addr = "https://api.github.com/repos/" + self._config.repo + "/contents/" + name;
            var data = {
                "message": "jStorage add/update",
                "content": btoa(content)
            };
            // This is required to update existing file (we need to tell github from what version we are trying to update)
            var sha = self._shaCache[name];
            if (sha) {
                data["sha"] = sha;
            }

            githubRequest("PUT", addr, self._config.token, data, function () {
                if (arguments.length >= 2) {
                    var info = arguments[1];
                    if (info.content && info.content.type == "file") {
                        callback(
                            {
                                'name': info.content.path,
                                'size': info.content.size,
                                'mime-type': 'text/html',
                                'modified': info['last-modified'],
                            },
                            { 'isOK': true, 'msg': '', 'code': 0 });
                    } else {
                        callback(null, { 'isOK': false, 'msg': 'This is not a valid file', 'code': -1 });
                    }
                } else {
                    callback(null, { 'isOK': false, 'msg': arguments[0].request.statusText, 'code': arguments[0].request.status });
                }
            });
        },
        move: function (currentName, newName, callback) {
            var self = this;

            //// Remove begining slash
            //if (name && name.indexOf('/') == 0) {
            //    name = name.substring(1);
            //}

            //// Remove ending slash
            //if (name && name[name.length - 1] == '/') {
            //    name = name.substring(0, name.length - 1);
            //}
            console.log('github move');
        },
        del: function (name, callback) {
            var self = this;

            // Remove begining slash
            if (name && name.indexOf('/') == 0) {
                name = name.substring(1);
            }

            // Remove ending slash
            if (name && name[name.length - 1] == '/') {
                name = name.substring(0, name.length - 1);
            }

            console.log('del', name);

            // update content of file
            addr = "https://api.github.com/repos/" + self._config.repo + "/contents/" + name;
            // sha is required to remove file, so we need to have called get before we can delete a file right now.
            var sha = self._shaCache[name];
            // If we don't already have sha, get it.
            if (!sha) {
                // find parent directory name
                var parentName = name;
                var index = parentName.lastIndexOf('/');
                if (index != -1) {
                    // We are looking a subdirectory
                    parentName = parentName.substring(0, index);
                } else {
                    // We are looking in root..
                    parentName = '';
                }

                var test = function (info, status) {
                    if (status.code == -2) {
                        // sha has been set, call ourself...
                        self.del(name, callback);
                    } else {
                        callback({ 'isOK': false, 'msg': 'no file or folder matching name', 'code': 404 });
                    }
                };
                self.get(parentName, test);
                return;
            }


            var data = {
                "message": "jStorage delete",
                "sha": sha
            };

            githubRequest("DELETE", addr, self._config.token, data, function () {
                if (arguments.length >= 2) {
                    var data = arguments[1].content;
                    callback({ 'isOK': true, 'msg': '', 'code': 0 });
                } else {
                    callback({ 'isOK': false, 'msg': arguments[0].request.statusText, 'code': arguments[0].request.status });
                }
            });
        },
        list: function (name, callback) {
            console.log('github list');

            // Remove begining slash
            if (name && name.indexOf('/') == 0) {
                name = name.substring(1);
            }

            // Remove ending slash
            if (name && name[name.length - 1] == '/') {
                name = name.substring(0, name.length - 1);
            }

            var self = this;
            addr = "https://api.github.com/repos/" + this._config.repo + "/contents/" + name;
            githubRequest("GET", addr, self._config.token, false, function () {
                console.log('listA', arguments);
                if (arguments.length >= 2) {
                    var info = arguments[1];
                    console.log('list', info);
                    if (info.type != "file") {

                        var list = [];
                        for (var i = 0; i < info.length; i++) {
                            list.push({
                                'name': info[i].name,
                                'path': '/' + info[i].path,
                                'size': info[i].size,
                                'mime-type': 'text/html',
                                'modified': info['last-modified']
                            });
                            self._shaCache[info[i].path] = info[i].sha;
                        }

                        console.log('list content:', list);

                        if (list.length != 0) {
                            callback(list, { 'isOK': true, 'msg': '', 'code': 0 });
                        } else {
                            callback(list, { 'isOK': false, 'msg': 'nothing to list', 'code': 404 });
                        }
                    } else {
                        callback([], { 'isOK': false, 'msg': 'This is not a valid file', 'code': -1 });
                    }
                } else {
                    callback([], { 'isOK': false, 'msg': arguments[0].request.statusText, 'code': arguments[0].request.status });
                }
            });
        },
        exists: function (name, callback) {
            console.log('github exists');
        },
        ensureAuth: function (wrapper, config) {
            // TODO: we require token today, allow for oauth fetching of token here


            //var scope = 'public_repo';
            //if (config.access && config.access == "private") {
            //    scope = 'repo';
            //}

            //// https://dev.jstorage.flowertwig.org/tests/github.html
            //var redirectUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;

            //var sections = window.location.search.split("&");
            //for (var i = 0; i < sections.length; i++) {
            //    var pair = sections[i].split('=');
            //    if (pair.length == 2) {
            //        var key = pair[0];
            //        var value = pair[1];

            //        key = key.replace(/^\?/, '');

            //        console.log('key: ' + key);
            //        console.log('value: ' + value);

            //        switch (key) {
            //            case 'state':
            //                _state = value;
            //                break;
            //            case 'code':
            //                _code = value;
            //                writeCookie('jStorage-github-code', value, 1);
            //                break;
            //        }
            //    }
            //}

            //var step = readCookie('jStorage-github-step');
            //switch (step) {
            //    default:
            //        writeCookie('jStorage-github-step', 'step2');
            //        writeCookie('jStorage-github-state', this._state, 1);

            //        window.location.assign('https://github.com/login/oauth/authorize?client_id=' + config.clientId + '&redirect_uri=' + redirectUrl + '&scope=' + scope + '&state=' + this._state);
            //        break;
            //    case 'step2':
            //        // TODO: Validate so state in cookie matches the state in query param.
            //        var code = readCookie('jStorage-github-code');

            //        var addr = 'https://github.com/login/oauth/access_token';
            //        //var addr = "https://githubservice.jstorage.flowertwig.org/api/Values";
            //        var data = 'client_id=' + config.clientId + '&client_secret=' + config.clientSecret + '&code=' + code + '&redirect_uri=' + redirectUrl;

            //        //var s = document.createElement('script'),
            //        //    h = document.getElementsByTagName('head')[0];
            //        //s.src = addr;
            //        //h.appendChild(s);

            //        //document.getElementsByName('client_id')[0].value = config.clientId;
            //        //document.getElementsByName('client_secret')[0].value = config.clientSecret;
            //        //document.getElementsByName('code')[0].value = code;
            //        //document.getElementsByName('redirect_uri')[0].value = redirectUrl;

            //        githubRequest('POST', addr, false, data, function() {
            //            console.log(arguments);
            //        });

            //        //request('https://github.com/login/oauth/access_token?client_id=' + config.clientId + '&client_secret=' + config.clientSecret + '&code=' + code + '&redirect_uri=' + redirectUrl);
            //        //https://github.com/login/oauth/access_token?client_id=df3a0f28472a4ad20f39&client_secret=f3029af7a93f39319b580dea5afbce693bb56876&code=d58c49123ecdaa0ba73c&redirect_uri=https://dev.jstorage.flowertwig.org/tests/github.html
            //            //access_token=9c32c17fe2225a36cc04a0f8975b8cd64a4210e0&scope=public_repo&token_type=bearer
            //        //writeCookie('jStorage-github-step', 'step3');
            //        break;
            //    case 'step3':
            //        //eraseCookie('jStorage-github-step');
            //        //eraseCookie('jStorage-github-state');
            //        //eraseCookie('jStorage-github-code');
            //        break;
            //}
        }
    };
})(jStorage);