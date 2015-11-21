chrome.runtime.sendMessage({
	action: 'insertCss'
}, function(){
	setTimeout(function(){
		$(document.documentElement).removeClass('github-filter-injected');
	}, 6000);
});

$(document.documentElement).addClass('github-filter-injected');