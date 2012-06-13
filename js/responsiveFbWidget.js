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
				var style = this.settings.styles.tall;
				
				if (this.wrapper.width() === this.settings.styles.wide.width ) {
					style = this.settings.styles.wide;
				}
				
				this.setWidth(style);
			},
			setWidth : function (style) {
				this.iframe = $('.fb-like-box').find('iframe');

				var loader = '<img src="/img/ajax-loader.gif" alt="Loading…"/>',
				newSrc = this.iframe.attr('src').replace(/&width=([0-9]*)/g, '&width=' + style.width).replace(/&height=([0-9]*)/g, '&height=' + style.height);
				console.log(newSrc);
				
				//this.domElem.css('display', 'none');
				//this.wrapper.append(loader);
				
				this.domElem.attr('data-width', style.width);
				this.domElem.attr('data-height', style.height);
				
				this.iframe.css('width', style.width);
				this.iframe.css('height', style.height);
				this.iframe.attr('src', newSrc);
				
			},
			widthOk : function (w) {
				return true;
			},
			resizeNeeded : function () {
				var wWidth = parseInt(this.wrapper.width()),
				eWidth = parseInt(this.domElem.width()),
				widthOk = this.widthOk(wWidth);

				if (eWidth != wWidth && widthOk)
				if (parseInt(this.domElem.width() + 40) != parseInt(this.wrapper.width()) && (this.wrapper.width() === (this.settings.styles.wide.width) || this.wrapper.width() === (this.settings.styles.tall.width))) {
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