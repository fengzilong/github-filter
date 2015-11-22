(function(){
	/*{
		create
		delete
		fork
		issues_closed
		issues_comment
		issues_opened
		member_add
		push
		star
	}*/

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

	var cssStatus = localStorage.status;

	try {
		cssStatus = JSON.parse(cssStatus);
	} catch(e) {
		cssStatus = {};
	}

	if(Object.keys(cssStatus) > 0){
		insertCSS('_all_', 'hide');
	}

	$('.ui.checkbox label').each(function(i, item){
		var $item = $(item);
		var result = cssStatus[$item.text()];

		if(result){
			$item.parents('.checkbox').checkbox('enable');
		} else {
			$item.parents('.checkbox').checkbox('disable');
		}
	});

	$('.ui.checkbox')
		.checkbox({
			onEnable: function(){
				var name = $(this).next().text();
				insertCSS('_all_', 'hide');
				insertCSS(name, 'show');
				//save
				cssStatus[name] = true;
				localStorage.status = JSON.stringify(cssStatus);
			},
			onDisable: function(){
				var name = $(this).next().text();
				insertCSS('_all_', 'hide');
				insertCSS(name, 'hide');
				//save
				cssStatus[name] = false;
				localStorage.status = JSON.stringify(cssStatus);
			}
		});

	var isMousedown = false;
	var toggled = '';
	var action = '';
	$(document).on('mousedown', function(){
		isMousedown = true;
		toggled = '';
		action = '';
	});
	
	$(document).on('mousemove', function(e){
		var $checkbox = $(e.target).parents('.checkbox');
		if(isMousedown){
			if($checkbox.length > 0){
				if($checkbox.find('label').text() !== toggled){
					if(action === ''){
						$checkbox.checkbox('toggle');
						if($checkbox.find('input:checked').length > 0){
							action = 'enable';
						} else {
							action = 'disable';
						}
					} else {
						$checkbox.checkbox(action);
					}
					
					toggled = $checkbox.find('label').text();
				}
			}
		}
	});
	
	$(document).on('mouseup', function(){
		isMousedown = false;
	});
})();