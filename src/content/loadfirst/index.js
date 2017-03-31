// inject is loaded on every page refresh, use this opportunity to clear the
// needs refresh state.
chrome.runtime.sendMessage({command:"refreshed", hostname:window.location.hostname}, function(response){
    // do nothing
});

// get the active user from background
chrome.runtime.sendMessage({command:"activeuser", hostname:window.location.hostname}, function(response) {
    // prevent the plugin from working on non-whitelisted domains or while inactive
    if(!response.state.enabled){
        return;
    }

    if(!response.whitelisted){
        console.warn('Unable to activate Lytics Stealth, domain not whitelisted. It is best to turn the plugin off while you are not actively giving a demonstration.');
        return;
    }

    // save to local storage
    localStorage.setItem('mock', JSON.stringify(response.mock));

    var handoff = function() {
        (function(w,d) {
            "use strict";   // Strict mode
            var stealthlite = stealthlite || {} // initiate stealthlite
            stealthlite.current = {}; // init current user

            // storage operations
            stealthlite.store = {
                set: function(key, value){
                    return localStorage.setItem(key, JSON.stringify(value));
                },
                get: function(key){
                    return JSON.parse(localStorage.getItem(key));
                }
            }

            stealthlite.setCookie = function(name,value,days) {
                var expires = "";
                if (days) {
                    var date = new Date();
                    date.setTime(date.getTime() + (days*24*60*60*1000));
                    expires = "; expires=" + date.toUTCString();
                }
                // set subdomain cookie
                document.cookie = name + "=" + value + expires + "; path=/;domain=."+window.location.hostname.replace('www.', '') ;

                // set domain cookie
                var fullurl = window.location.hostname.replace('www.', '').split('.');
                fullurl.shift();
                document.cookie = name + "=" + value + expires + "; path=/;domain=." + fullurl.join('.');
            }

            stealthlite.flushUser = function(){
                var user = stealthlite.store.get('mock');
                console.log(user);
                // update cookie and profile if there is a set uid
                if(user.uid !== ""){
                    stealthlite.setCookie('seerid', user.uid, 90);
                    console.log('[stealth] setting users _uid to "' + user.uid + '"')
                }

                stealthlite.current = user;

                return user;
            }

            w.stealthlite = stealthlite;
        }(window, document));

        // when lytics loads update the paylaod and flush all the pre-set values before running integrations
        var onLyticsCallback = function(data){
            console.log(data);

            var w = window,
                newSegmentArray = [],
                excludeSegmentArray = [];

            // for demo purposes we want to wipe the entire set of segments returned by lytics
            if(window.stealthlite.current.segments.length > 0){
                data.segments = ['all'];
            }

            // inject mock segments from profile
            // if the segment starts with a bang(!) we need to exclude it (not supported yet)
            for (var i = 0; i < window.stealthlite.current.segments.length; i++) {
                if(!window.stealthlite.current.segments[i]){
                    continue;
                }

                if(window.stealthlite.current.segments[i].startsWith('!')){
                    excludeSegmentArray.push(window.stealthlite.current.segments[i].slice(1));
                } else {
                    data.segments.push(window.stealthlite.current.segments[i]);
                    console.log('[stealth] adding segment "' + window.stealthlite.current.segments[i]);
                }
            }

            for (var x = 0; x < excludeSegmentArray.length; x++) {
                for (var y = data.segments.length - 1; y >= 0; y--) {
                    if (data.segments[y] === excludeSegmentArray[x]) {
                        data.segments.splice(y, 1);
                        console.log('[stealth] removing segment "' + excludeSegmentArray[x]);
                    }
                }
            }

            if (data && data.segments) {
                for (var i = data.segments.length - 1; i >= 0; i--) {
                    w.lio.segmentsHash[data.segments[i]] = data.segments[i];
                    newSegmentArray.push(data.segments[i]);
                }
                w.lio.segmentsArray = w.lio.newSegmentArray;
                w.lio.segmentsCookie = w.lio.segmentsHash;
                w.lio.segmentsString = w.lio.keysForObject(w.lio.segmentsHash).toString().replace(/,+/g, ',');
                w.lio.setCookie("ly_segs", w.lio.segmentsHash, 15);
                w.lio.data = data;

                // add pathfora
                w.lio.integrationsConfig.allowPathfora = true;
                w.lio.integrationsConfig.hasActiveCampaign = true;
            }
        }

        window.stealthlite.flushUser();

        // init callbacks
        !function(l,a){a.liosetup=a.liosetup||{},a.liosetup.callback=a.liosetup.callback||[],a.liosetup.addEntityLoadedCallback=function(l,o){if("function"==typeof a.liosetup.callback){var i=[];i.push(a.liosetup.callback),a.liosetup.callback=i}a.lio&&a.lio.loaded?l(a.lio.data):o?a.liosetup.callback.unshift(l):a.liosetup.callback.push(l)}}(document,window);
        window.liosetup.addEntityLoadedCallback(onLyticsCallback, true);
    }

    console.log('[stealth] adding user overrides');

    // pass js from extension to client
    var script = document.createElement("script");
    script.textContent = "(" + handoff.toString() + "())";
    document.documentElement.appendChild(script);
});