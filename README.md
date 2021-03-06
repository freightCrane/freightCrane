# freightCrane - Storage made Easy

[![Build Status](https://travis-ci.org/freightCrane/freightCrane.svg?branch=master)](https://travis-ci.org/freightCrane/freightCrane)

freightCrane helps you get started with using cloud storage (Like Dropbox or GitHub).
With freightCrane you just need to learn 1 API and you can easily add support for more providers in your project.

 Storage		                |     Status    |     Read more about storage   |
:-------------------------------|:--------------|:---------------
 [Dropbox](#preparing-dropbox)	| Implemented	| https://www.dropbox.com/
 localStorage					| Implemented	| https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Storage
 [GitHub](#preparing-github)	| Implemented	| https://github.com/
 MS Azure						| Planned 		| https://account.windowsazure.com/Home/Index
 SkyDrive 						| Planned 		| https://skydrive.live.com/
 Google Drive 					| Planned 		| https://drive.google.com/
 Box							| Planned 		| https://www.box.com/

## Demo

<https://jstorage.azurewebsites.net/demo/>


## Prepare provider(s)

Depending on the storage provider you want to use you need to do some steps at the provider to prepare it for usage.
Below we are listing the steps needed for every provider.


### Preparing Dropbox

1. Go to: https://www.dropbox.com/developers/apps
2. Click the "Create app"
3. Choose "Dropbox API app" and "Files and datastores".
4. Either choose own folder for your app or access to all files in Dropbox (If you are unsure, use own folder for app. It is more secure for both you and the user)
5. Enter app name (This name will be visible for your users so choose a good one. ''Only use ASCII characters'').
6. Write down the "App Key" for later use.
7. Write a address into "OAuth redirect URIs", this is the address the user will be sent to after giving your app permissions. Please note that it MUST to start with "https://" to work if you are using a DNS. Also note that it must not be a fragment URI, it must be a plain URI.


### Preparing GitHub

There is two ways of using GitHub.
The recommended way is to use a token service, this way your users will easily be redirected to GitHub to login, approve your application (And your required scope) and that is it.
The other method requires your users to login to GitHub, navigate to a page and manually create a token, copy the token and use in your application.

Following steps are general for both methods.

1. Go to: https://github.com/settings/applications
2. Click the "Register new application" button.
3. Enter info about your application, most importantly the "Authorization callback URL" value.
4. Click the "Register application" button.

#### Use Token Service

#### Use Token

1. Have a place where your users can enter their token (they can create it here: https://github.com/settings/tokens/new and the "repo" scope is required )
2.



## Setup

include
```html
<script src="freightCrane.js">
```
and the approperate module that represent the storage you want to use.
You can use all of them at the same time.

```html
<script src="freightCrane.dropbox.js">
<script src="freightCrane.github.js">
<script src="freightCrane.localstorage.js">
```

## API

### freightCrane(initConfig)

_Dropbox_

```js
var storage = freightCrane({
	'name': 'dropbox',
	'appKey': 'APP KEY YOU SAVED FROM STEP 6 IN PREPARE DROPBOX SECTION',
	'callback': function(storage, callStatus) {
		if (callStatus.isOK) {
			// dropbox storage are now ready to be used.
		}
	}
});
```

_GitHub (Token Service)_

```js
var storage = freightCrane({
	'name': 'github',
	'repo': 'REPOSITORY NAME YOU WANT YOUR USERS TO ACCESS',
	'scope': 'repo',
	'tokenService': 'https://githubtokenservice-jstorage-flowertwig-org.loopiasecure.com/', // You SHOULD use your own service for additional security
	'callback': function(storage, callStatus) {
		if (callStatus.isOK) {
			// github storage are now ready to be used.
		}
	}
});
```

_GitHub (Token)_

```js
var storage = freightCrane({
	'name': 'github',
	'repo': 'REPOSITORY NAME YOU WANT YOUR USERS TO ACCESS',
	'token': 'TOKEN user has entered'
	'callback': function(storage, callStatus) {
		if (callStatus.isOK) {
			// github storage are now ready to be used.
		}
	}
});
```


_localStorage_

```js
var storage = freightCrane({
	'name': 'localstorage',
	'callback': function(storage, callStatus) {
		if (callStatus.isOK) {
			// local storage are now ready to be used.
		}
	}
});
```


### get(file_path, callback(file, callStatus))

Read content of file.

```js
storage.get('testing.txt', function(file, callStatus) {
	if (callStatus.isOK) {

	}
});
```

### set(file_path, content, callback(fileMeta, callStatus))

Write file content.

```js
storage.set('testing.txt', 'Hello World!', function(metaData, callStatus) {
	if (callStatus.isOK) {

	}
});
```

### move(file_path_current, file_path_new, callback(callStatus))

Move file from one location to a new.

```js
storage.move('testing.txt', 'testing2.txt', function(callStatus) {
	if (callStatus.isOK) {

	}
});
```

### del(file_or_folder_path, callback(callStatus, file_or_folder_path))

Remove file or folder.

```js
storage.del('testing.txt', function(callStatus, file_or_folder_path) {
	if (callStatus.isOK) {

	}
});
```

### list(directory_path, callback(fileMeta[], callStatus))

List all files in directory.

```js
storage.lists('/', function(files, callStatus) {
	if (callStatus.isOK) {
		for(var i = 0; i < files.length; i++) {
			// files[i].name
		}
	}
});
```

### exists(file_path, callback(bool, callStatus))

Does file exists?

```js
storage.exists('testing.txt', function(file_exists, callStatus) {
	if (callStatus.isOK) {
		if (file_exists) {
			// File exists
		} else {
			// File didn't exist
		}
	}
});
```


### initConfig



```js
{
	'name': 'dropbox',
	[...]
	'callback': function(callStatus) {

	}
}
```

### callStatus

Indicate if the call was successfull or not.
Object has the following properties:

- isOK - is true or false, depending on if the call was successfull or not.
- msg - human readable status message
- code - status code, can be used to do different actions depending on value. read more on the specific method to get all possible values.

```js
{
	'isOK': true,
	'code': 0,
	'msg': ''
}
```

### file

Object used in get method, object has the following properties:
- name - filename including extension and directory.
- size - size in bytes, represented by long.
- mime-type - mime type of file.
- modified - date file was modified.
- data - content of file as string or byte array.

```js
{
	'name': 'testing.txt',
	'size': 1024,
	'mime-type': 'text/html',
	'modified': Wed Jan 01 2014 15:11:07 GMT+0100 (W. Europe Standard Time),
	'data': byte array or string depending on mime-type
}
```

### fileMeta

Object returned for getMeta and list methods, object has the following properties:
- name - filename including extension and directory.
- size - size in bytes, represented by long.
- mime-type - mime type of file.
- modified - date file was modified.

```js
{
	'name': 'testing.txt',
	'size': 1024,
	'mime-type': 'text/html'
	'modified': Wed Jan 01 2014 15:11:07 GMT+0100 (W. Europe Standard Time)
}
```


# License
MIT

# Contributing
- Pull requests are welcome.
- Setup and test locally before submitting issues.
  - `npm install && npm test`
  - Also test manually locally by following the next section.


## Testing locally:
Setting up dropbox and github for testing.
- Copy `tests/testconfig-example.js` to `tests/testconfig.js`
- Fill in your own credentials into `tests/testconfig.js` according to
  ["Prepare Providers"](#prepare-providers).
- Host the freightCrane repo on a local webserver (f.x: `python -m SimpleHTTPServer` in the repo folder on Unix/Linux/BSD-based systems).
- Open `/tests/index.htm` in your browser on the path to the local webserver.
- Sign in into Dropbox and Github when prompted.
