(function($) {

	$.fn.responsiveLikeBox = function (options) {
		
		// Create some defaults, extending them with any options that were provided
		var settings = $.extend( {
			width : this.attr('data-width'),
			height : this.attr('data-width'),
			colorScheme : this.attr('data-colorscheme'),
			showFaces : this.attr('data-show-faces'),
			borderColor : this.attr('data-border-color'),
			showStream : this.attr('data-stream'),
			showHeader : this.attr('data-header'),
			URIhelper : {
				width : 'width',
				height : 'height',
				colorScheme : 'colorscheme',
				showFaces : 'show_faces',
				showStream : 'stream',
				showHeader : 'header'
			},
			attrHelper : {
				width : 'data-width',
				height : 'data-height',
				colorScheme : 'data-colorscheme',
				showFaces : 'data-show-faces',
				borderColor : 'data-border-color',
				showStream : 'data-stream',
				showHeader : 'data-header'
			}
		}, options);
	
		return this.each(function(){
			// Create the widget object assigning it to the wrapper (witch get the initalizer $().responsiveLikeBox();)
			var widget = this;
			
			// Extend to full object
			widget.init = function () {
				return $(this).each(function(){
			    	$(window).bind('load.responsiveLikeBox resize.responsiveLikeBox', widget.iframe.resize);
			    });
			};
			
			widget.wrapper = {
			    $domElem : $(this),
			    apperance : function(el) {
			    	// Hacky replace of quotes in JSON formated CSS
			    	var data = window.getComputedStyle(el, '::after').content.replace('\'', '').replace('\'', '');
			    	
			    	// If JSON is'nt correctly formated will throw here
			    	try {
				    	return JSON.parse(data)
			    	}
			    	
			    	catch (e) {
				    	console.log('There seem to be a problem with your JSON format in your CSS: ' + e.message);
			    	}
			    }
			};
			
			widget.iframe = {
			    apperance : settings, /* Takes the settings object (the markup implementation unless specified when initalizing) */
			    resize : function () {
			    	// Check if styles matches
			    	var newApperance = widget.wrapper.apperance(widget);
			    	
			    	// Check wether the src is set yet. Resize depends on it
			    	if (widget.wrapper.$domElem.find('iframe').attr('src')) {
				    	if(JSON.stringify(widget.iframe.apperance) != JSON.stringify(newApperance)){
				        	//Change all data in iframe and data-attrs
				        	var newSrc = widget.wrapper.$domElem.find('iframe').attr('src');
				        	
				        	for (option in newApperance){
				        		
				        		// Replace data-attrs for all options
				        		widget.wrapper.$domElem.attr(settings.attrHelper[option], newApperance[option]);
				        					        	
					        	// Replace URI values in iframe URI. Exclude borderColor since it is not in URI
					        	if (option != 'borderColor'){
					        		var regEx = new RegExp('&' + settings.URIhelper[option] + '=([a-z0-9]*)', 'g');
						        	newSrc = newSrc.replace(regEx, 
						        	'&' + settings.URIhelper[option] + '=' + newApperance[option]);
					        	}
					        	
					        	// Width and height need more replacements
					        	if (option === 'width' || option === 'height'){
					        		// Reset inline styles for wrapping span
						        	widget.wrapper.$domElem.children('span').css(option, newApperance[option]);
						        	
						        	// Set inline styles for iframe
						        	widget.wrapper.$domElem.find('iframe').css(option, newApperance[option]);
					        	}
					        	
					        	// Set border color on iframe
					        	if (option === 'borderColor'){
						        	widget.wrapper.$domElem.find('iframe').css('border-color', newApperance[option]);
					        	}
					        	
					        	// Set new src (will make it reload)
					        	widget.wrapper.$domElem.find('iframe').attr('src', newSrc);
					        	
					        	// Set iframe apperance to the new apperance without actually checking. Should be a callback to iframe load.
					        	widget.iframe.apperance = newApperance;
				        	}
				        	
				        	/*
				        	// Replace width and height
				        	newSrc = newSrc.replace(/&width=([0-9]*)/g, '&width=' + newApperance.width);
				        	newSrc = newSrc.replace(/&height=([0-9]*)/g, '&height=' + newApperance.height);
				        	
				        	// Replace colorScheme, showFaces, showStream, showHeader
				        	newSrc = newSrc.replace(/&colorscheme=([0-9a-z]*)/g, '&colorscheme=' + newApperance.colorScheme);
				        	newSrc = newSrc.replace(/&show_faces=([a-z]*)/g, '&show_faces=' + newApperance.showFaces);
				        	newSrc = newSrc.replace(/&stream=([0-9a-z]*)/g, '&stream=' + newApperance.showStream);
				        	newSrc = newSrc.replace(/&header=([a-z]*)/g, '&header=' + newApperance.showHeader);
				        	
				        	// To be consisten change the data-attrs in wrapper
				        	widget.wrapper.$domElem.attr('data-width', newApperance.width);
				        	widget.wrapper.$domElem.attr('data-height', newApperance.height);
				        	
				        	widget.wrapper.$domElem.attr('data-colorscheme', newApperance.colorScheme);
				        	widget.wrapper.$domElem.attr('data-show-faces', newApperance.showFaces);
				        	widget.wrapper.$domElem.attr('data-border-color', newApperance.borderColor);
				        	widget.wrapper.$domElem.attr('data-stream', newApperance.showStream);
				        	widget.wrapper.$domElem.attr('data-header', newApperance.showHeader);
				        	
				        	// Reset inline styles for wrapping span
				        	widget.wrapper.$domElem.children('span').css('width', newApperance.width);
				        	widget.wrapper.$domElem.children('span').css('height', newApperance.height);
				        	
				        	// Set inline styles for iframe
				        	widget.wrapper.$domElem.find('iframe').css('width', newApperance.width);
				        	widget.wrapper.$domElem.find('iframe').css('height', newApperance.height);
				        	widget.wrapper.$domElem.find('iframe').css('border-color', newApperance.borderColor);
				        	
				        	// Set new src (will make it reload)
				        	widget.wrapper.$domElem.find('iframe').attr('src', newSrc);
				        	
				        	// Set iframe apperance to the new apperance without actually checking. Should be a callback to iframe load.
				        	widget.iframe.apperance = newApperance; */
				    	}	
				    	
			    	}
			    	
			    	// If src is'nt set yet try again
			    	else {
				    	setTimeout(widget.iframe.resize, 1000);
			    	}
			    }
			};
			
			widget.init();
		});	
	}
	
})(jQuery);