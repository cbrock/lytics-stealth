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
      // version: chrome.runtime.getManifest().version,
      account: '',
      unclean: false,
      activeDemo: '',
      activeProfile: '',
      whiteListedProfiles: [],
      whiteListedDomains: []
    },
    profiles: {},
    demos: {}
  }



  // **************************************************************************
  // defaults
  // **************************************************************************
  stealth.defaults = {
    profiles: require('./defaultprofiles.js'),
    demos: require('./defaultdemos.js')
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
  // mock operations
  // **************************************************************************
  stealth.mock = function(){
    if(stealth.settings.state.activeProfile){
      var profile = stealth.profile.get(stealth.settings.state.activeProfile);

      if(profile){
        // check for dynamic params on profile
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
  // domain whitelist management
  // **************************************************************************
  stealth.domain = {
    allowed: function (url, callback) {
      if(!stealth.settings.state.whiteListedDomains || stealth.settings.state.whiteListedDomains.length < 1){
        return false;
      }

      if(url === 'current'){
        url = w.location.hostname;
      }

      if(typeof url === 'undefined'){
        return false;
      }

      var pos = stealth.settings.state.whiteListedDomains.indexOf(url.toLowerCase());
      if(pos > -1 || stealth.settings.state.whiteListedDomains.length === 0){
        if(callback){
          callback(true);
        }
        return true;
      }

      if(callback){
        callback(false);
      }

      return false;
    },
    add: function (domain, callback) {
      if(!stealth.domain.validate(domain)){
        alert('invalid domain name');
        return false;
      }

      if(!stealth.settings.state.whiteListedDomains){
        stealth.settings.state.whiteListedDomains = [];
      }

      console.log('domain', domain);

      var pos = stealth.settings.state.whiteListedDomains.indexOf(domain.toLowerCase());
      if(pos === -1){
        stealth.settings.state.whiteListedDomains.push(domain.toLowerCase());

        if(callback){
          callback(stealth.settings.state.whiteListedDomains, true);
        }
        return true;
      }

      if(callback){
        callback(stealth.settings.state.whiteListedDomains, false);
      }
      return false;
    },
    remove: function (domain, callback) {
      if(!stealth.settings.state.whiteListedDomains){
        return false;
      }

      var pos = stealth.settings.state.whiteListedDomains.indexOf(domain.toLowerCase());
      if(pos > -1){
        stealth.settings.state.whiteListedDomains.splice(pos, 1);

        if(callback){
          callback(stealth.settings.state.whiteListedDomains, true);
        }
        return true;
      }

      if(callback){
        callback(stealth.settings.state.whiteListedDomains, false);
      }
      return false;
    },
    validate: function(domain) {
      console.log(domain);
      if (/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(domain)) {
        return true;
      } else {
        return false;
      }
    }
  };



  // **************************************************************************
  // variable map management
  // **************************************************************************
  stealth.var = {
    get: function(key){
      if(key === 'all'){
        return stealth.settings.state.var || {};
      }

      if(stealth.settings.state.var){
        return stealth.settings.state.var[key];
      } else {
        return '';
      }
    },
    set: function(key, value){
      if(!stealth.settings.state.var){
        stealth.settings.state.var = {};
      }
      stealth.settings.state.var[key] = value;
      return true;
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
    var overwrite;
    var allKeys = Object.keys(stealth.profile.all());

    for (var i = 0; i < allKeys.length; i++) {
      if(allKeys[i] === key){
        overwrite = true;
        break;
      }
    }

    if(key === 'new'){
      if(value.id !== ''){
        overwrite = true;
        key = value.id;
      }
    }

    if(overwrite){
      stealth.dev.log('debug', 'overwriting profile record for ' + key);
      stealth.settings.profiles[key] = value;
      stealth.save.settings(callback);
    }else{
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
    var demos = stealth.demo.all();

    // if the demo exists return it
    if(!!demos[id]){
      return demos[id];
    }

    return undefined;
  }

  stealth.demo.all = function() {
    return Object.assign({}, stealth.defaults.demos, stealth.settings.demos);
  }

  stealth.demo.update = function(key, value, remove, callback) {
    var overwrite;
    var allKeys = Object.keys(stealth.demo.all());

    // validate the minimum requirements

    // if the key already exists we are doing an overwrite rather than a new entry
    for (var i = 0; i < allKeys.length; i++) {
      if(allKeys[i] === key){
        overwrite = true;
        break;
      }
    }

    if(overwrite) {
      stealth.dev.log('debug', 'overwriting demo record for ' + key);
    } else {
      key = value.id;
      stealth.dev.log('debug', 'adding new demo record for ' + key);
    }

    stealth.settings.demos[key] = value;
    stealth.save.settings(callback);
  }

  stealth.demo.reset = function (id, callback) {
    // reset the demos in settings to the default
    console.warn('need to reset to the default here');

    // activate the demo
    stealth.demo.activate(id, true, callback);
  }

  stealth.demo.activate = function (id, reset, callback) {
    var demos = stealth.demo.all();

    stealth.dev.log('debug', 'activating demo ' + id);

    if(!!demos[id]){
      stealth.dev.log('debug', 'found demo ' + id);

      // set active demo id
      stealth.settings.state.activeDemo = demos[id].id;

      // set the account id
      // check if the id is associated with a variable key before setting
      if(stealth.settings.state.var && typeof stealth.settings.state.var[demos[id].account] !== 'undefined' && stealth.settings.state.var[demos[id].account] !== '') {
        stealth.dev.log('debug', 'setting account to value defined in setting variables ' + stealth.settings.state.var[demos[id].account]);
        stealth.settings.state.account = stealth.settings.state.var[demos[id].account];
      } else {
        stealth.dev.log('debug', 'setting account to value defined in definition ' + demos[id].account);
        if(demos[id].account.length < 15) {
          stealth.settings.state.account = '';
        } else {
          stealth.settings.state.account = demos[id].account;
        }
      }

      // set the whitelisted profiles
      stealth.settings.state.whiteListedProfiles = demos[id].whiteListedProfiles;

      // set the active profile
      if(demos[id].whiteListedProfiles.length > 0){
        stealth.settings.state.activeProfile = demos[id].whiteListedProfiles[0];
      }

      // reset the profiles
      if(reset && typeof stealth.defaults.demos[id] !== 'undefined'){
        for (var i = 0; i < stealth.demo.all()[id].whiteListedProfiles.length; i++) {
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
  stealth.script = {
    load: function(url, callback){
      var script = d.createElement("script")
      script.type = "text/javascript";

      script.onload = function(){
        if(callback){
          callback();
        }
      };

      script.src = url;
      d.getElementsByTagName("head")[0].appendChild(script);
    }
  }

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
  stealth.init = function(callback) {
    stealth.dev.log('info', 'loading current settings');

    stealth.load.settings(function(){

      stealth.dev.log('info', 'loading current settings');

      // if there is currently no demo set, default to the first demo
      if(!stealth.settings.state.activeDemo){
        stealth.demo.activate(Object.keys(stealth.defaults.demos)[0], false, function(){
          stealth.dev.log('info', 'first time loading, setting up default demo: ' + Object.keys(stealth.defaults.demos)[0]);
        })
      }

      callback();
    });
  }

  w.stealth = stealth;

}(window, document));