(function (jStorage, undefined) {
    function writeCookie(name,value,days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
    }

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
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

        //xmlhttp.dataType = "json";

        xmlhttp.open(method, address, true);

        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status >= 200 && this.status < 300 || this.status === 304) {
                    callback(null, raw ? this.responseText : this.responseText ? JSON.parse(this.responseText) : true, this);
                } else {
                    callback({ path: address, request: this, error: this.status });
                }
            }
        };


        //xmlhttp.setRequestHeader('Accept', 'application/vnd.github.raw+json');
        //xmlhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        //xmlhttp.setRequestHeader("Origin", window.location.protocol + '//' + window.location.host);
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
            this._state = 'random' + new Date().getTime();
            this._code = false;

            var scope = 'public_repo';
            if (config.access && config.access == "private") {
                scope = 'repo';
            }

            // https://dev.jstorage.flowertwig.org/tests/github.html
            var redirectUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;

            var sections = window.location.search.split("&");
            for (var i = 0; i < sections.length; i++) {
                var pair = sections[i].split('=');
                if (pair.length == 2) {
                    var key = pair[0];
                    var value = pair[1];

                    key = key.replace(/^\?/, '');

                    console.log('key: ' + key);
                    console.log('value: ' + value);

                    switch (key) {
                        case 'state':
                            _state = value;
                            break;
                        case 'code':
                            _code = value;
                            writeCookie('jStorage-github-code', value, 1);
                            break;
                    }
                }
            }

            var step = readCookie('jStorage-github-step');
            switch (step) {
                default:
                    writeCookie('jStorage-github-step', 'step2');
                    writeCookie('jStorage-github-state', this._state, 1);

                    window.location.assign('https://github.com/login/oauth/authorize?client_id=' + config.clientId + '&redirect_uri=' + redirectUrl + '&scope=' + scope + '&state=' + this._state);
                    break;
                case 'step2':
                    // TODO: Validate so state in cookie matches the state in query param.
                    var code = readCookie('jStorage-github-code');
                    writeCookie('jStorage-github-step', 'step3');

                    var addr = 'https://github.com/login/oauth/access_token';
                    var data = 'client_id=' + config.clientId + '&client_secret=' + config.clientSecret + '&code=' + code + '&redirect_uri=' + redirectUrl;

                    //var s = document.createElement('script'),
                    //    h = document.getElementsByTagName('head')[0];
                    //s.src = addr;
                    //h.appendChild(s);

                    document.getElementsByName('client_id')[0].value = config.clientId;
                    document.getElementsByName('client_secret')[0].value = config.clientSecret;
                    document.getElementsByName('code')[0].value = code;
                    document.getElementsByName('redirect_uri')[0].value = redirectUrl;

                    //githubRequest('POST', addr, false, data, function() {
                    //    console.log(arguments);
                    //});

                    //request('https://github.com/login/oauth/access_token?client_id=' + config.clientId + '&client_secret=' + config.clientSecret + '&code=' + code + '&redirect_uri=' + redirectUrl);
                    //https://github.com/login/oauth/access_token?client_id=df3a0f28472a4ad20f39&client_secret=f3029af7a93f39319b580dea5afbce693bb56876&code=d58c49123ecdaa0ba73c&redirect_uri=https://dev.jstorage.flowertwig.org/tests/github.html
                        //access_token=9c32c17fe2225a36cc04a0f8975b8cd64a4210e0&scope=public_repo&token_type=bearer
                    break;
                case 'step3':
                    eraseCookie('jStorage-github-step');
                    eraseCookie('jStorage-github-state');
                    eraseCookie('jStorage-github-code');
                    break;
            }




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