(function($) {

    $.fn.responsiveFbWidget = function(options) {

        var fbWidget =  {
			domElem : this,
			wrapper : this.parent(),
			iframe : this.find('iframe'),
			settings : $.extend({
		        styles: {
		        	wide : {
						width : 715,
						height : 330
					},
					tall : {
						width : 185,
						height : 500
					}
		        	
		        }
		    }, options),

			resize : function () {
				var style = this.settings.style.tall;
				
				if (this.wrapper.width() === this.settings.style.wide.width ) {
					style = this.settings.style.wide;
				}
				
				this.setWidth(style);
			},
			setWidth : function (style) {
				this.iframe = $('.fb-like-box').find('iframe');

				var loader = '<img src="/img/ajax-loader.gif" alt="Loading…"/>',
				newSrc = this.iframe.attr('src').replace(/&width=([0-9]*)/g, '&width=' + style.width - 40).replace(/&height=([0-9]*)/g, '&height=' + style.height);
				console.log(newSrc);
				
				//this.domElem.css('display', 'none');
				//this.wrapper.append(loader);
				
				this.domElem.attr('data-width', style.width - 40);
				this.domElem.attr('data-height', style.height);
				
				this.iframe.css('width', style.width - 40);
				this.iframe.css('height', style.height);
				this.iframe.attr('src', newSrc);
				
			},
			resizeNeeded : function () {
				if (this.domElem.width() + 40 != this.wrapper.width() && this.wrapper.width() === this.wide.width || this.wrapper.width() === this.tall.width) {
					return true;
					console.log('resizing...');
				}
				else {
					return false;
				}
			}
			
		};

		$(window).resize(function () {
			if (fbWidget.resizeNeeded()){
				fbWidget.resize();
			}
		});
    };

})(jQuery);