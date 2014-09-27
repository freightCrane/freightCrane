var providersToTest = [
	{ 'name': 'localstorage' },
	{ 'name': 'dropbox' },
	{ 'name': 'github' }
];

QUnit.module("Core");
QUnit.test("Core sanity checks", function () {
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

for (var i = 0; i < providersToTest.length; i++) {
	var storageInfo = providersToTest[i];
	QUnit.module(storageInfo.name);
	QUnit.test("pling", function (assert) {
		assert.ok(true, "This test is ok");
	});
}
//QUnit.test("Provider");


//test()