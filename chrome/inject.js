chrome.runtime.sendMessage({
	action: 'insertCss'
}, function(){
	$(document.documentElement).removeClass('github-filter-injected');
});

$(document.documentElement).addClass('github-filter-injected');