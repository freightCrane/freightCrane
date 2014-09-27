var providersToTest = [
	{ 'name': 'localstorage', 'config': {}, 'requireSecure': false },
	{ 'name': 'dropbox', 'config': { 'appKey': 'elazxasyxdt1pkc' }, 'requireSecure': true }
	//{ 'name': 'github', 'config': {}, 'requireSecure': true }
];

function isValidStorage(storage, assert, text) {
	assert.ok('init' in storage, text + " has init function");
	assert.ok('get' in storage, text + " has get function");
	assert.ok('set' in storage, text + " has set function");
	assert.ok('del' in storage, text + " has del function");
	assert.ok('list' in storage, text + " has list function");
	assert.ok('exists' in storage, text + " has exists function");
}

function isValidStatus(status, assert, text) {
	assert.ok('isOK' in status, text + " has isOK function");
	assert.ok('code' in status, text + " has code function");
	assert.ok('msg' in status, text + " has msg function");
}

QUnit.module("Core");
QUnit.test("sanity checks", function () {
	throws(function () {
		jStorage();
	}, /^jStorage: No config, please consult the readme ;\)$/, "Missing config object should throw error");
	throws(function () {
		jStorage({});
	}, /^jStorage: No name in config.$/, "Empty config object should throw error");
	throws(function () {
		jStorage({ 'callback': false });
	}, /^jStorage: No name in config.$/, "Name missing in config object should throw error");
	throws(function () {
		jStorage({ 'name': '' });
	}, /^jStorage: Storage provider "" was not loaded.$/, "Empty name for provider should throw error");
	throws(function () {
		jStorage({ 'name': 'adsdsada' });
	}, /^jStorage: Storage provider "adsdsada" was not loaded.$/, "Bad name value for provider should throw error");
});

QUnit.test("Has providers property", function (assert) {
	assert.ok(!!jStorage.providers, "Test is ok");
});
QUnit.test("Has all expected providers", function (assert) {
	for (var i = 0; i < providersToTest.length; i++) {
		assert.ok(providersToTest[i].name in jStorage.providers, "'" + providersToTest[i].name + "' exists as provider");
	}
});
QUnit.test("Only has expected providers", function (assert) {
	var count = 0;
	for (var provider in jStorage.providers) {
		count++;
		var found = false;
		for (var i = 0; i < providersToTest.length; i++) {
			if (providersToTest[i].name === provider) {
				found = true;
			}
		}
		assert.ok(found, "'" + provider + "' was found in jStorage.providers");
	}

	// We have this assert just so we have asserts IF providers are empty.
	if (count == 0) {
		assert.ok(true, "no providers to test");
	}
});

function testStorage(name, config, requireSecure) {
	QUnit.module(name);
	QUnit.test("sanity check", function (assert) {
		isValidStorage(jStorage.providers[name], assert);
		if (requireSecure && window.location.protocol !== "https:") {
			assert.ok(false, "require https connection (Change address to page)");
		}
	});

	QUnit.asyncTest("can create storage", function (assert) {
		config.name = name;
		config.callback = function (storage) {
			assert.ok(true, "callback was called");
			isValidStorage(storage, assert, "callback object");

			storage.get('jstorage-unit-test1', function (obj, status) {
				isValidStatus(status, assert, "get status");
				assert.ok(!status.isOK, "Get content, should get no hit.");
				storage.set('jstorage-unit-test1', 'Test content', function (obj2, status2) {
					isValidStatus(status2, assert, "set status");
					assert.ok(status2.isOK, "Set content, successfully created content.");
					storage.get('jstorage-unit-test1', function (obj3, status3) {
						isValidStatus(status3, assert, "get status");
						assert.ok(status3.isOK, "Get content, callback was successfully called.");
						assert.ok(obj3.data == 'Test content', "Get content, successfully got correct content.");

						storage.del('jstorage-unit-test1', function (status4) {
							isValidStatus(status4, assert, "del status");
							assert.ok(status4.isOK, "successfully removed content.");
							QUnit.start();
						});
					});
				});
			});
		}
		var obj = jStorage(config);
		assert.ok(true, "configuration is right");
		isValidStorage(obj, assert, "jStorage function return object");

		//assert.ok(storage.constructor.name == 'jStorage.fn.jStorage.init', "object created is of correct type");
	});

	QUnit.asyncTest("can list storage", function (assert) {
		config.name = name;
		config.callback = function (storage) {
			storage.list('/jstorage-unit-test2/', function (list, status) {
				isValidStatus(status, assert, "list status");
				assert.ok(!status.isOK, "list folder content, should get no hit.");

				storage.set('/jstorage-unit-test2/content1', 'Test content', function (obj2, status2) {
					storage.set('/jstorage-unit-test2/content2', 'Test content2, what todo.', function (obj3, status3) {
						storage.list('/jstorage-unit-test2/', function (list2, status3) {
							assert.ok(status3.isOK, "list folder content, status is correct.");
							assert.ok(list2.length == 2, "number of files in folder is correct");
							storage.del('/jstorage-unit-test2', function (status4) {
								isValidStatus(status4, assert, "del list status");
								assert.ok(status4.isOK, "successfully removed folder.");
								QUnit.start();
							});
						});
					});
				});
			});
		}
		var obj = jStorage(config);
	});
}

for (var providerIndex = 0; providerIndex < providersToTest.length; providerIndex++) {
	var storageInfo = providersToTest[providerIndex];
	testStorage(storageInfo.name, storageInfo.config, storageInfo.requireSecure);
}