// require('../../../dist/stealth.js');
import StealthLibrary from '../../../dist/stealth.js';

// *********************************************************
// General Constant Tests
// *********************************************************
describe('test general and/or default values', function() {
  it('should return a version number', function() {
    expect(stealth.version).toBeTruthy();
  });

  it('should return a valid unix timestamp', function() {
    expect(stealth.updated).toBeGreaterThan(1400000000000);
  });
});


// *********************************************************
// Default Tests
// *********************************************************
describe('test that defaults are loaded and formatted correctly', function() {
  it('should return a set of default profiles', function() {
    expect(Object.keys(stealth.defaults.profiles).length).toBeGreaterThan(0);
  });

  it('should return the correct data for the james default profile', function() {
    var james = stealth.defaults.profiles.james;
    expect(james.id).toBe('james');
    expect(james.name).toBe('James');
    expect(james._uid).toBe('830320543f0f4a8fb325348ff0cd56d3');
    expect(james.image).toBe('james.png');
    expect(james.segments.length).toBeGreaterThan(0);
    expect(james.affinities.length).toBeGreaterThan(0);
  });

  it('should return a set of default demos', function() {
    expect(Object.keys(stealth.defaults.demos).length).toBeGreaterThan(0);
  });

  it('should return the correct data for the google_dfp default', function() {
    var dfp = stealth.defaults.demos.google_dfp;
    expect(dfp.id).toBe('google_dfp');
    expect(dfp.account).toBe('ecom_acct_id');
    expect(dfp.name).toBe('Google DFP Demo');
    expect(dfp.url).toBe('https://master.lyticsdemo.com');
    expect(dfp.description.length).toBeGreaterThan(0);
    expect(dfp.whiteListedProfiles.length).toBeGreaterThan(0);
    expect(dfp.supportingTabs.length).toBeGreaterThan(0);
  });
});


// *********************************************************
// Logging Tests
// *********************************************************
describe('test that all log levels return the correct message text', function() {
  it('should return a debug level message', function() {
    expect(stealth.dev.log('debug', 'test message')).toBe('[stealth] debug: test message');
  });

  it('should return a info level message', function() {
    expect(stealth.dev.log('info', 'test message')).toBe('[stealth] info: test message');
  });

  it('should return a warn level message', function() {
    expect(stealth.dev.log('warn', 'test message')).toBe('[stealth] warn: test message');
  });

  it('should return a error level message', function() {
    expect(stealth.dev.log('error', 'test message')).toBe('[stealth] error: test message');
  });

  it('should return a false when unsure how to handle message', function() {
    expect(stealth.dev.log('bonk', 'test message')).toBe(false);
  });
});


// *********************************************************
// Storage Tests
// *********************************************************
describe('test that we can get and set local storage items', function() {
  it('should save a test variable to storage', function() {
    stealth.storage.set('test', 'working', function(d){
      expect(d.test).toBe('working');
    });
  });

  it('should get a test variable from storage', function() {
    stealth.storage.get('test', function(d){
      expect(d).toBe('working');
    });
  });

  it('should save the settings object to storage', function() {
    // test that we can save the default settings
    stealth.save.settings(function(d){
      expect(d.settings.state.enabled).toBe(false);
    });

    // test that we can save updated settings
    stealth.settings.state.enabled = true;
    stealth.save.settings(function(d){
      expect(d.settings.state.enabled).toBe(true);
    });
  });

  it('should get the settings object from storage', function() {
    stealth.load.settings(function(d){
      expect(d.settings.state.enabled).toBe(true);
    });
  });
});


// *********************************************************
// Mock Tests
// *********************************************************
describe('test that mock method returns proper data for setup', function() {
  it('should return the full details of the mocked profile', function() {
    stealth.profile.activate("james", function(d){
      var m = stealth.mock();
      expect(m.uid).toBe('830320543f0f4a8fb325348ff0cd56d3');
      expect(m.segments.indexOf('all')).toBeGreaterThan(-1);
      expect(m.segments.indexOf('demo_known')).toBeGreaterThan(-1);
    })
  });
});


// *********************************************************
// Domain Whitelist Tests
// *********************************************************
describe('test that we can manage and validate domain whitelists properly', function() {
  var domain;

  it('should validate the format of domain', function() {
    domain = 'getlytics.com';
    expect(stealth.domain.validate(domain)).toBe(true);

    domain = 'activate.getlytics.io';
    expect(stealth.domain.validate(domain)).toBe(true);

    domain = 'getlytics.co.uk';
    expect(stealth.domain.validate(domain)).toBe(true);

    domain = 'localhost';
    expect(stealth.domain.validate(domain)).toBe(true);

    domain = 'http://getlytics.com';
    expect(stealth.domain.validate(domain)).toBe(false);

    domain = 'https://getlytics.com';
    expect(stealth.domain.validate(domain)).toBe(false);

    domain = '//getlytics.com';
    expect(stealth.domain.validate(domain)).toBe(false);

    domain = 'getlytics';
    expect(stealth.domain.validate(domain)).toBe(false);
  });

  it('should add the domain', function() {
    domain = 'getlytics.com';
    stealth.domain.add(domain, function(d){
      expect(d.indexOf(domain)).toBeGreaterThan(-1);
      expect(d.length).toBe(1);
    })

    domain = 'getlytics.com';
    stealth.domain.add(domain, function(d){
      expect(d.indexOf(domain)).toBeGreaterThan(-1);
      expect(d.length).toBe(1);
    })

    domain = 'activate.getlytics.com';
    stealth.domain.add(domain, function(d){
      expect(d.indexOf(domain)).toBeGreaterThan(-1);
      expect(d.length).toBe(2);
    })
  });

  it('should remove the domain', function() {
    domain = 'activate.getlytics.com';
    stealth.domain.remove(domain, function(d){
      expect(d.indexOf(domain)).toBe(-1);
      expect(d.length).toBe(1);
    })
  });

  it('should allow the domain', function() {
    domain = 'getlytics.com';
    stealth.domain.allowed(domain, function(d){
      expect(d).toBe(true);
    });

    domain = 'fake.getlytics.com';
    stealth.domain.allowed(domain, function(d){
      expect(d).toBe(false);
    });
  });
});


// *********************************************************
// Variable Mapping Tests
// *********************************************************
describe('test that we can get and set generic variables', function() {
  it('should set a key/value', function() {
    var set = stealth.var.set('vartest', true);
    expect(set).toBe(true);

    var set2 = stealth.var.set('bacon', 'delicious');
    expect(set2).toBe(true);
  });

  it('should get a key/value', function() {
    var get = stealth.var.get('vartest');
    expect(get).toBe(true);

    var get2 = stealth.var.get('bacon');
    expect(get2).toBe('delicious');
  });
});


// *********************************************************
// Profile Tests
// *********************************************************
describe('test that all profile management functions are working properly', function() {
  it('should return all available profiles', function() {
    // stealth.profile.all();
  });

  it('should return a specific profile', function() {
    // stealth.profile.get('james');
  });

  it('should whitelist a specific profile', function() {
    // stealth.profile.whitelisted
  });

  it('should activate a specific profile', function() {
    // stealth.profile.activate
  });

  it('should update a specific profile', function() {
    // stealth.profile.update
  });

  it('should reset a specific profile', function() {
    // stealth.profile.reset
  });
});


// *********************************************************
// Demo Tests
// *********************************************************
describe('test that all profile management functions are working properly', function() {
  it('should return all available demos', function() {
    // stealth.demo.all();
  });

  it('should return a specific demo', function() {
    // stealth.demo.get('dfp');
  });

  it('should activate a specific demo', function() {
    // stealth.demo.activate
  });

  it('should update a specific demo', function() {
    // stealth.demo.update
  });

  it('should reset a specific demo', function() {
    // stealth.demo.reset
  });
});


// *********************************************************
// Utility Tests
// *********************************************************
describe('test all of the generic utility functions the main library relies on', function() {
  it('should return the value for a particular key of an object', function() {
    expect(stealth.index({'test1':'sample1', 'test2':'sample2'}, 'test2')).toBe('sample2');
  });

  it('should get the value of a key within an object based on dot notation', function() {
    var obj = {
      testing:{
        dot:{
          notation:'valid'
        }
      }
    }

    var str = 'testing.dot.notation';

    expect(str.split('.').reduce(stealth.index, obj)).toBe('valid');
  });

  it('should generate a random 4 digit string', function() {
    var gen = {};
    for (var i = 0; i < 50; i++) {
      gen[stealth.S4()] = true;
    }
    expect(Object.keys(gen).length).toBe(50);
  });

  it('should generate a unique _uid', function() {
    var gen = {};
    for (var i = 0; i < 50; i++) {
      var _uid = stealth.uid();
      expect(_uid.startsWith("stealth.")).toBe(true);
      gen[_uid] = true;
    }
    expect(Object.keys(gen).length).toBe(50);
  });

  it('should extend an object', function() {
    var obj1 = {
      one: 1
    };
    var obj2 = {
      two: 2
    };
    var obj3 = {
      three: 3
    };
    var obj4 = {
      one: 9,
      three: 5
    };

    // with all uniques
    var objOut = stealth.extend(obj1, obj2, obj3);
    expect(objOut.one).toBe(1);
    expect(objOut.two).toBe(2);
    expect(objOut.three).toBe(3);

    // with overwrite
    var objOut = stealth.extend(obj1, obj2, obj3, obj4);
    expect(objOut.one).toBe(9);
    expect(objOut.two).toBe(2);
    expect(objOut.three).toBe(5);
  });

  it('should inject javascript into the head', function() {
    stealth.script.load('https://storage.googleapis.com/lytics_files/externaltest.js', function(d){
      // need to write tests for this / determine if it should stay in the library
    })
  });
});


// *********************************************************
// Init Tests
// *********************************************************
describe('test that all defaults and proper settings are loaded when the library is initialized', function() {
  it('should have the proper default state', function() {
    // add ecom demo var

    // enabled false
    // active demo
    // whitelisted profiles
    // activated profile
    // correct mock
  });
});