#jStorage - Storage made Easy#



##Setup##

include
```html
<script src="jStorage.js">
```
and the approperate module that represent the storage you want to use.
You can use all of the at the same time.

```html
<script src="jStorage.dropbox.js">
<script src="jStorage.github.js">
```

##Usage##

Initiate the storage with a provider and it is ready to be used.

```js
var dbStorage = jStorage('dropbox');
var testing = dbStorage.get('testing');
```

```js
var ghStorage = jStorage('github');
var testing = ghStorage.get('testing');
```
