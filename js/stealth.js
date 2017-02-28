(function(w,d) {
  "use strict";   // Strict mode

  var stealth = stealth || {}
  stealth.version  = '1.0.0';
  stealth.updated  = Date.now();



  // **************************************************************************
  // settings
  // **************************************************************************
  stealth.settings = {
    state: {
      enabled: false,
      version: chrome.runtime.getManifest().version,
      account: '',
      unclean: false,
      activeDemo: '',
      activeProfile: '',
      whiteListedProfiles: []
    },
    profiles: {}
  }



  // **************************************************************************
  // defaults
  // **************************************************************************
  stealth.defaults = {
    profiles: defaultProfiles,
    demos: defaultDemos
  }



  // **************************************************************************
  // developer tools
  // **************************************************************************
  stealth.dev = {};

  stealth.dev.debug = true;

  stealth.dev.log = function (level, message) {
    var namespace = '[stealth]';

    switch(level) {
      case 'debug':
        if(stealth.dev.debug){
          console.log(namespace + ' ' + level + ': ' + message);
        }
        break;
      case 'info':
        console.log(namespace + ' ' + level + ': ' + message);
        break;
      case 'warn':
        console.warn(namespace + ' ' + level + ': ' + message);
        break;
      case 'error':
        console.error(namespace + ' ' + level + ': ' + message);
        break;
    }
  }



  // **************************************************************************
  // storage operations
  // **************************************************************************
  stealth.storage = {}

  stealth.storage.set = function(key, value, callback){
    var obj = {};
    obj[key] = value;

    chrome.storage.sync.set(obj, function(data){
      if(callback){
        callback(data);
      }
      return true;
    })
  }

  stealth.storage.get = function(key, callback){
    chrome.storage.sync.get(key, function(data){
      if(callback){
        callback(data);
      }
      return true;
    })
  }

  stealth.save = {
    settings: function(callback){
      stealth.storage.set('settings', stealth.settings, callback)
    }
  }

  stealth.load = {
    settings: function(callback){
      stealth.storage.get('settings', function(data){
        stealth.settings = Object.assign(stealth.settings, data.settings);
        stealth.save.settings(callback);
      })
    }
  }



  // **************************************************************************
  // storage operations
  // **************************************************************************
  stealth.mock = function(){
    if(stealth.settings.state.activeProfile){
      var profile = stealth.profile.get(stealth.settings.state.activeProfile);

      if(profile){
        // check for dynamic params on profile
        console.log(profile);

        if(profile._uid == '__random__'){
          profile._uid = stealth.uid();
          stealth.profile.update('_uid', profile._uid, false, function(){
            var mock = {
              account: stealth.settings.state.account,
              uid: profile._uid,
              segments: profile.segments.concat(profile.affinities)
            }

            return mock;
          })
        } else {
          var mock = {
            account: stealth.settings.state.account,
            uid: profile._uid,
            segments: profile.segments.concat(profile.affinities)
          }

          return mock;
        }
      }
    }

    throw {
      name: 'error',
      message: 'unable to create mock on incomplete or invalid profile'
    }
  }



  // **************************************************************************
  // profile management
  // **************************************************************************
  stealth.profile = {}

  stealth.profile.activate = function (id, callback) {
    stealth.settings.state.activeProfile = id;
    stealth.save.settings(callback);
  }

  stealth.profile.all = function() {
    return Object.assign({}, stealth.defaults.profiles, stealth.settings.profiles);
  }

  stealth.profile.get = function (id) {
    // check modified profiles
    stealth.dev.log('debug', 'checking modified profiles');
    if(!!stealth.settings.profiles[id]){
      return stealth.settings.profiles[id];
    }

    // check default profiles
    stealth.dev.log('debug', 'checking default profiles');
    if(!!stealth.defaults.profiles[id]){
      return stealth.defaults.profiles[id];
    }

    return undefined;
  }

  stealth.profile.update = function (key, value, remove, callback) {
    // get the profile
    var profile = stealth.extend(stealth.profile.get(stealth.settings.state.activeProfile))

    // update the key
    if(key === "segments" || key === "affinities"){
      if(remove){
        // remove from the array
        var index = profile[key].indexOf(value);
        if (index > -1) {
            profile[key].splice(index, 1);
        }
      } else {
        profile[key].push(value);
      }
    } else {
      profile[key] = value;
    }

    stealth.settings.profiles[profile.id] = profile;

    stealth.save.settings(callback);
  }

  stealth.profile.reset = function(id) {
    stealth.settings.profiles[id] = stealth.extend(stealth.defaults.profiles[id]);
    stealth.save.settings();
  }

  stealth.profile.whitelisted = function () {
    var wl = stealth.settings.state.whiteListedProfiles;
    var out = [];

    for (var i = 0; i < wl.length; i++) {
      if(typeof wl[i] !== 'undefined' && wl[i]){
        out.push(stealth.profile.get(wl[i]))
      }
    }

    return out;
  }



  // **************************************************************************
  // demo management
  // **************************************************************************
  stealth.demo = {};

  stealth.demo.get = function(id){
    var demos = stealth.defaults.demos;

    // if the demo exists return it
    if(!!demos[id]){
      return demos[id];
    }

    return undefined;
  }

  stealth.demo.reset = function (id, callback) {
    // activate the demo
    stealth.demo.activate(id, true, callback);
  }

  stealth.demo.activate = function (id, reset, callback) {
    var demos = stealth.defaults.demos;

    stealth.dev.log('debug', 'activating demo ' + id);

    if(!!demos[id]){
      stealth.dev.log('debug', 'found demo ' + id);

      // set active demo id
      stealth.settings.state.activeDemo = demos[id].id;

      // set the account id
      stealth.settings.state.account = demos[id].account;

      // set the whitelisted profiles
      stealth.settings.state.whiteListedProfiles = demos[id].whiteListedProfiles;

      // set the active profile
      if(demos[id].whiteListedProfiles.length > 0){
        stealth.settings.state.activeProfile = demos[id].whiteListedProfiles[0];
      }

      // reset the profiles
      if(reset){
        for (var i = 0; i < stealth.defaults.demos[id].whiteListedProfiles.length; i++) {
          stealth.profile.reset(stealth.defaults.demos[id].whiteListedProfiles[i]);
        }
      }

      stealth.save.settings(callback);
      return;
    }

    throw {
      name: 'error',
      message: 'unable to assign demo due to invalid id'
    }
  }



  // **************************************************************************
  // utilities
  // **************************************************************************
  stealth.index = function(obj,i) {
    return obj[i];
  }

  stealth.decode = function(value) {
    return value.split('.').reduce(stealth.index, stealth.settings)
  }

  stealth.extend = function(){
    var extended = {},
        deep = false,
        i = 0,
        length = arguments.length;

    // Check if a deep merge
    if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
        deep = arguments[0];
        i++;
    }

    // Merge the object into the extended object
    var merge = function (obj) {
        for ( var prop in obj ) {
            if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                // If deep merge and property is an object, merge properties
                if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                    extended[prop] = extend( true, extended[prop], obj[prop] );
                } else {
                    extended[prop] = obj[prop];
                }
            }
        }
    };

    // Loop through each object and conduct a merge
    for ( ; i < length; i++ ) {
        var obj = arguments[i];
        merge(obj);
    }

    return extended;
  }

  stealth.S4 = function() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  }

  stealth.uid = function() {
    return ('stealth.'+stealth.S4()+stealth.S4()+stealth.S4()+stealth.S4()+stealth.S4()+stealth.S4()+stealth.S4());
  }



  // **************************************************************************
  // library initialization
  // **************************************************************************
  stealth.dev.log('info', 'loading current settings');

  stealth.load.settings(function(){
    stealth.dev.log('info', 'loading current settings');

    // if there is currently no demo set, default to the first demo
    if(!stealth.settings.state.activeDemo){
      stealth.demo.activate(Object.keys(stealth.defaults.demos)[0], false, function(){
        stealth.dev.log('info', 'first time loading, setting up default demo: ' + Object.keys(stealth.defaults.demos)[0]);
      })
    }
  });

  w.stealth = stealth;

}(window, document));