var chromeStorageMock = (function() {
    var data = {}
    return {
        tabs: {
            query: function(){
                console.log('query');
            },
            update: function(){
                console.log('update');
            }
        },
        storage: {
            sync:{
                set: function(obj, fn){
                    var d = chrome.storage.extend(chrome.data, obj);
                    chrome.data = d;
                    fn(chrome.data);
                },
                get: function(key, fn){
                    fn(chrome.data[key]);
                }
            },
            extend: function(){
                var extended = {};
                var deep = false;
                var i = 0;
                var length = arguments.length;

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
        }
    }
})()
Object.defineProperty(window, 'chrome', { value: chromeStorageMock });