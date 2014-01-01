#jStorage - Storage made Easy#

jStorage helps you get started with using cloud storage (Like Dropbox or GitHub).
With jStorage you just need to learn 1 API and you can easily add support for more providers.

##Prepare provider(s)##

Depending on the storage provider you want to use you need to do some steps at the provider to prepare it for usage.
Below we are listing the steps needed for every provider.

###Preparing Dropbox###

1. Go to: https://www.dropbox.com/developers/apps
2. Click the "Create app"
3. Choose "Dropbox API app" and "Files and datastores".
4. Either choose own folder for your app or access to all files in Dropbox (If you are unsure, use own folder for app. It is more secure for both you and the user)
5. Enter app name (This name will be visible for your users so choose a good one).
6. Write down the "App Key" for later use.
7. Write a address into "OAuth redirect URIs", this is the address the user will be sent to after giving your app permissions. Please note that it MUST to start with "https://" to work if you are using a DNS.


##Setup##

include
```html
<script src="jStorage.js">
```
and the approperate module that represent the storage you want to use.
You can use all of them at the same time.

```html
<script src="jStorage.dropbox.js">
<script src="jStorage.github.js">
```

##Usage##

Initiate the storage with a provider and it is ready to be used.


##API##

###jStorage(initConfig)###

_Dropbox_

```js
var storage = jStorage({
	'name': 'dropbox',
	'appKey': 'APP KEY YOU SAVED FROM STEP 6 IN PREPARE DROPBOX SECTION',
	'callback': function(callStatus) {
		// dropbox storage are now ready to be used.
	}
});
```

_GitHub_

```js
var storage = jStorage({
	'name': 'github',
	'callback': function(callStatus) {
		// github storage are now ready to be used.
	}
});
```


###get(file_path, callback)###

Read content of file.

```js
storage.get('testing.txt', function() {

});
```

###set(file_path, content, callback)###

Write file content.

```js
storage.set('testing.txt', 'Hello World!', function() {

});
```

###del(file_path, callback)###

Remove file.

```js
storage.del('testing.txt', function() {

});
```


###lists(directory_path, callback)###

List all files in directory.

```js
storage.lists('testing.txt', function() {

});
```

###exists(file_path, callback)###

Does file exists?

```js
storage.exists('testing.txt', function() {

});
```


###initConfig###



```js
{
	'name': 'dropbox',
	[...]
	'callback': function(callStatus) {

	}
}
```

###callStatus###

Indicate if the call was successfull or not.
The returned object has a property "status" that can have the following values:

- _OK_ - Call was ended successfully, everything is fine.
- _ERROR_ - Something went wrong, read msg property to know more

and a msg property that is only populated if the status was not OK.


```js
{
	'status': 'OK',
	'msg': ''
}
```
