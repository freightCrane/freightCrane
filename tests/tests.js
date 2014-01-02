test( "Core sanity checks", function() {
    throws(function(){
        jStorage();
    }, /^jStorage: No config, please consult the readme ;\)$/, "No config object should throw error");
    throws(function(){
        jStorage({});
    }, /^jStorage: No name in config.$/, "Empty config object should throw error");
    throws(function(){
        jStorage({'callback':false});
    }, /^jStorage: No name in config.$/, "Name missing in config object should throw error");
    throws(function(){
        jStorage({'name':''});
    }, /^jStorage: Storage provider "" was not loaded.$/, "Empty name for provider should throw error");
    throws(function(){
        jStorage({'name': 'adsdsada'});
    }, /^jStorage: Storage provider "adsdsada" was not loaded.$/, "Bad name value for provider should throw error");
});