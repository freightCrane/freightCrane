#jStorage - Storage made Easy#



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

```js
var dbStorage = jStorage('dropbox', function() {
	// dropbox storage are now ready to be used.

	dbStorage.get('testing', function(data) {
		// do something with the data here...
	);
});
```

```js
var ghStorage = jStorage('github', function() {
	// github storage are now ready to be used.

	ghStorage.get('testing', function(data) {
		// do something with the data here...
	});
});
```
