var rule = {
	conditions : [
		new chrome.declarativeContent.PageStateMatcher({
			pageUrl: {urlMatches: '^https://github\.com/$'},
			css: ['#dashboard']
		})
	],
	actions : [new chrome.declarativeContent.ShowPageAction()]
}

chrome.runtime.onInstalled.addListener(function(details) {
	chrome.declarativeContent.onPageChanged.removeRules(null, function() {
		chrome.declarativeContent.onPageChanged.addRules([rule]);
	});
});

function insertCSS(name, type){
	chrome.tabs.query({
		active: true
	}, function(tabs){
		if(tabs.length > 0){
			try {
				chrome.tabs.insertCSS(tabs[0].id, {
					file: '/chrome/github_css/' + name + '/' + type + '.css'
				}, function(){
				});
			} catch(e) {
				//cancel
			}
		}
	});
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	var action = message.action;

	switch(action){
		case 'insertCss':
			var cssStatus = localStorage.status;

			try {
				cssStatus = JSON.parse(cssStatus);
			} catch(e) {
				cssStatus = {};
			}

			if(Object.keys(cssStatus) > 0){
				insertCSS('_all_', 'hide');
			}

			for(var i in cssStatus){
				if(cssStatus[i]){
					insertCSS(i, 'show');
				} else {
					insertCSS(i, 'hide');
				}
			}

			setTimeout(function(){
				sendResponse({
					success: true
				});
			}, 1000);
			break;
		default:
			sendResponse({
				success: true
			});
	}
});
