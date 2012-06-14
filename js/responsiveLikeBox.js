(function($) {

	$.fn.responsiveLikeBox = function (options) {
		
		// Create some defaults, extending them with any options that were provided
		var settings = $.extend( {
			width : this.attr('data-width'),
			height : this.attr('data-width'),
			colorScheme : this.attr('data-colorscheme'),
			showFaces : this.attr('data-show-faces'),
			borderColor : escape(this.attr('data-border-color')),
			showStream : this.attr('data-stream'),
			showHeader : this.attr('data-header'),
			URIhelper : {
				width : 'width',
				height : 'height',
				colorScheme : 'colorscheme',
				showFaces : 'show_faces',
				borderColor : 'border_color',
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
			var widget = this, loader;
			
			// Extend to full object
			widget.init = function () {
				loader = $('<img class="responsive-lb-loader" src="img/ajax-loader.gif" alt="Loaing..."/>').appendTo(widget.wrapper.$domElem.parent());
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
				    	// Print error in widget
				    	$('<p class="error-msg">There seem to be a problem with your JSON format in your CSS. The error message says: <strong>' 
				    	+ e.message + '</strong></p>').appendTo(el);
			    	}
			    }
			};
			
			widget.iframe = {
			    apperance : settings, /* Takes the settings object (the markup implementation unless specified when initalizing) */
			    resize : function () {
			    	
			    	// Check wether the src is set yet. Resize depends on it
			    	if (widget.wrapper.$domElem.find('iframe').attr('src')) {
			    	
			    		// Check if styles matches
			    		var newApperance = widget.wrapper.apperance(widget);
			    		
				    	if(JSON.stringify(widget.iframe.apperance) != JSON.stringify(newApperance)){
				    	
				    		// Hide widget and show ajax spinner
				    	
				    		//var iframe = widget.wrapper.$domElem.find('iframe').css('visibility', 'none');
				    		
				        	//Change all data in iframe and data-attrs
				        	var newSrc = widget.wrapper.$domElem.find('iframe').attr('src');
				        	
				        	for (option in newApperance){
				        		
				        		// Replace data-attrs for all options
				        		widget.wrapper.$domElem.attr(settings.attrHelper[option], newApperance[option]);
				        		
				        		//Replace all querysting parameters in ifram src		        	
					        	// Match on any queryparameter with option name
					            var regEx = new RegExp('[?&]' + settings.URIhelper[option] + '=([a-z0-9%]*)', 'g');
					            
					            // Build new queryparameter
						        newSrc = newSrc.replace(regEx, 
						        newSrc.match(regEx).toString().substring(0,1) 
						        + settings.URIhelper[option] + '=' + escape(newApperance[option]));
					        	
					        	// Width and height need more replacements
					        	if (option === 'width' || option === 'height'){
					        		// Reset inline styles for wrapping span
						        	widget.wrapper.$domElem.children('span').css(option, newApperance[option]);
						        	
						        	// Set inline styles for iframe
						        	widget.wrapper.$domElem.find('iframe').css(option, newApperance[option]);
					        	}
					        	
					        	// Set new src (will make it reload)
					        	widget.wrapper.$domElem.find('iframe').attr('src', newSrc);
					        	
					        	// Set iframe apperance to the new apperance without actually checking. Should be a callback to iframe load.
					        	widget.iframe.apperance = newApperance;
				        	}
				        	
				        	loader.remove();
				        	
				    	}
				    	
			    	}
			    	
			    	// If src is'nt set yet try again
			    	else {
				    	var poll = setTimeout(widget.iframe.resize, 1000);
				    	console.log(poll);
			    	}
			    }
			};
			
			widget.init();
		});	
	}
	
})(jQuery);