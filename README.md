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

###Dropbox Init###

```js
var dbStorage = jStorage({
	'name': 'dropbox',
	'appkey': 'APP KEY YOU SAVED FROM STEP 6',
	'callback': function() {
		// dropbox storage are now ready to be used.
	}
});
```

###GitHub Init###

```js
var ghStorage = jStorage({
	'name': 'github',
	'callback': function() {
		// github storage are now ready to be used.
	}
});
```


##API##

###get(file_path, callback)###

Read content of file.

###set(file_path, content, callback)###

Write file content.

###del(file_path, callback)###

Remove file.

###lists(directory_path, callback)###

List all files in directory.

###exists(file_path, callback)###

Does file exists?

