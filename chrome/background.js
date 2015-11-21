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
	var status = null;
	
	try {
		status = JSON.parse( localStorage.status );
	} catch( e ) {
		status = {};
	}
	
	localStorage.status = JSON.stringify(
		_.extend(
			{
				create: true,
				delete: true,
				fork: true,
				issues_closed: true,
				issues_comment: true,
				issues_opened: true,
				member_add: true,
				push: true,
				star: true
			},
			status
		)
	);
	
	chrome.declarativeContent.onPageChanged.removeRules(null, function() {
		chrome.declarativeContent.onPageChanged.addRules([rule]);
	});
});

function insertCSS(name, type){
	chrome.tabs.query({
		url: 'https://github.com/'
	}, function(tabs){
		_.each(tabs, function( tab ){
			try {
				chrome.tabs.insertCSS(tab.id, {
					file: '/chrome/github_css/' + name + '/' + type + '.css'
				}, function(){
				});
			} catch(e) {
				//cancel
			}
		});
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

			if(Object.keys(cssStatus).length > 0){
				insertCSS('_all_', 'hide');
			}

			for(var i in cssStatus){
				if(cssStatus[i]){
					insertCSS(i, 'show');
				} else {
					insertCSS(i, 'hide');
				}
			}

			sendResponse({
				success: true
			});
			break;
		default:
			sendResponse({
				success: true
			});
	}
});
