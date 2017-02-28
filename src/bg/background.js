// handle messages
var processMessage = function(message, callback){
	console.log('stealth available:' + typeof stealth);
	// get most recent settings
	switch(message.command) {
		case 'activeuser':
			callback({
				mock: stealth.mock(),
				state: stealth.settings.state
			});
			break;
		case 'state':
			callback({
				mock: stealth.mock(),
				state: stealth.settings.state
			});
			break;
		case 'refreshed':
			stealth.settings.state.needsRefresh = false;
			stealth.save.settings(function(){
				callback(true);
			}.bind(this))
			break;
		default:
			callback('unknown message, unable to handle');
	};
}

stealth.load.settings(function(){
	stealth.dev.log('info', 'background: loading initial settings');
});

// listen for changes to the settings and refresh them so bg has latest
chrome.storage.onChanged.addListener(function(changes, namespace) {
	if('settings' in changes) {
		stealth.load.settings(function(){
			stealth.dev.log('info', 'background: refreshing settings on sync change');
		}.bind(this));
	}
});

// look for initial load
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
	    setTimeout(function () {
	    	stealth.dev.log('info', 'background: running initial setup on fresh install');
	    	stealth.demo.activate(Object.keys(stealth.defaults.demos)[0])
	    }, 2500);
    }else if(details.reason == "update"){
    	// handle update
    }
});

// listen for messages from content
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
	processMessage(message, sendResponse);
});