(function($) {

	$.fn.responsiveLikeBox = function (options) {
		
		// Create some defaults, extending them with any options that were provided
		var settings = $.extend( {
			width : this.attr('data-width'),
			height : this.attr('data-width'),
			showFaces : this.attr('data-show-faces'),
			showStream : this.attr('data-stream'),
			showHeader : this.attr('data-header')
		}, options);
	
		return this.each(function(){
			// Create the widget object
			var widget = this;
			
			// Extend to full object
			widget.init = function () {
				return $(this).each(function(){
			    	$(window).bind('load.responsiveLikeBox resize.responsiveLikeBox', widget.iframe.resize);
			    	//setTimeout(widget.iframe.resize, 5000); /* This must be iframe load event because iframe does'nt get src until! */
			    });
			};
			
			widget.wrapper = {
			    $domElem : $(this),
			    apperance : function(el) {
			    	var data = window.getComputedStyle(el, '::after').content.replace('\'', '').replace('\'', ''); /* Hacky replace of quotes */
			    	//console.log(data);
			    	return JSON.parse(data)
			    }
			};
			
			widget.iframe = {
			    apperance : settings, /* Should take from HTML implementation */
			    resize : function () {
			    	// Check if styles matches
			    	var newApperance = widget.wrapper.apperance(widget);
			    	
			    	/* Check wether the src is set yet. Resize depends on it */
			    	if (widget.wrapper.$domElem.find('iframe').attr('src')) {
				    	if(JSON.stringify(widget.iframe.apperance) != JSON.stringify(newApperance)){
				        	//Change all data in iframe and data-attrs
				        	var newSrc = widget.wrapper.$domElem.find('iframe').attr('src').replace(/&width=([0-9]*)/g, '&width=' + newApperance.width).replace(/&height=([0-9]*)/g, '&height=' + newApperance.height);
				        	
				        	widget.wrapper.$domElem.attr('data-width', newApperance.width);
				        	widget.wrapper.$domElem.attr('data-height', newApperance.height);
				        	
				        	widget.wrapper.$domElem.children('span').css('width', newApperance.width);
				        	widget.wrapper.$domElem.children('span').css('height', newApperance.height);
				        	
				        	widget.wrapper.$domElem.find('iframe').css('width', newApperance.width);
				        	widget.wrapper.$domElem.find('iframe').css('height', newApperance.height);
				        	widget.wrapper.$domElem.find('iframe').attr('src', newSrc);
				        	
				        	// Set iframe apperance to the new apperance without actually checking. Should be a callback to iframe load.
				        	widget.iframe.apperance = newApperance;
				    	}	
				    	
			    	}
			    	
			    	else {
				    	setTimeout(widget.iframe.resize, 1000); /* If src is'nt set yet try again */
			    	}
			    }
			};
			
			widget.init();
		});	
	}
	
})(jQuery);