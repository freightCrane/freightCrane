var providersToTest = [
	{ 'name': 'localstorage', 'config': {}, 'requireSecure': false },
	{ 'name': 'dropbox', 'config': {}, 'requireSecure': true },
	{ 'name': 'github', 'config': {}, 'requireSecure': true }
];

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
		assert.ok('init' in jStorage.providers[name], "has init function");
		assert.ok('get' in jStorage.providers[name], "has get function");
		assert.ok('set' in jStorage.providers[name], "has set function");
		assert.ok('del' in jStorage.providers[name], "has del function");
		assert.ok('list' in jStorage.providers[name], "has list function");
		assert.ok('exists' in jStorage.providers[name], "has exists function");
		if (requireSecure && window.location.protocol !== "https:") {
			assert.ok(false, "require https connection (Change address to page)");
		}
	});

}

for (var providerIndex = 0; providerIndex < providersToTest.length; providerIndex++) {
	var storageInfo = providersToTest[providerIndex];
	testStorage(storageInfo.name, storageInfo.config, storageInfo.requireSecure);
}