$(document.documentElement).addClass('github-filter-injected');

chrome.runtime.sendMessage({
	action: 'insertCss'
}, function(){
	setTimeout(function(){
		$(document.documentElement).removeClass('github-filter-injected');
	}, 6000);
});

$(function(){
	var $win = $( window ),
		$doc = $( document ),
		timer = null;

	function calc(){
		var $loadMore = $('.ajax-pagination-btn');
		if( $loadMore.length > 0 ){
			var documentHeight = $doc.height(),
				scrollTop = $win.scrollTop(),
				windowHeight = $win.height();

			if( documentHeight - scrollTop - windowHeight < ( windowHeight / 3 ) ){
				$loadMore[0].click();
			}
		} else {
			$win.off( this );
		}
	}

	$win.on('mousewheel', function( e ){
		var scrollTop = $win.scrollTop();

		if( scrollTop === 0 && window.event.deltaY > 0 ){
			$('.ajax-pagination-btn')[0].click();
		} else if( scrollTop > 0 ) {
			$win.off( e );
		}
	});

	$win.on('scroll', function( e ){
		if( timer ){
			clearTimeout( timer );
		}
		
		timer = setTimeout(function(){
			calc.call( e );
		}, 200);
	});
});