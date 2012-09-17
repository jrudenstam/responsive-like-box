/*
Responsive Facebook Like Box 1.0
https://github.com/jrudenstam/responsive-like-box

Copyright 2012 Jacob Rudenstam

Released under MIT license
http://jrudenstam.mit-license.org/

resizeend.js © 2012 Dominik Porada
Distributed under the MIT license: http://porada.mit-license.org
*/

;(function ($) {
	'use strict';
	
	// Check browser dependencies
	if (!(window.addEventListener && document.createEvent && window.dispatchEvent && JSON && window.getComputedStyle)) {
		return;
	}


	// resizeend.js © 2012 Dominik Porada (30 lines)
	var dispatchResizeEndEvent = function () {
		var event = document.createEvent("Event");
		event.initEvent("resizeend", false, false);
		window.dispatchEvent(event);
	};

	// Assuming `window.orientation` is all about degrees
	// (or nothing), the function returns either 0 or 90
	var getCurrentOrientation = function () {
		return Math.abs(+window.orientation || 0) % 180;
	};

	var initialOrientation = getCurrentOrientation();
	var currentOrientation;
	var resizeDebounceTimeout;

	window.addEventListener("resize", function () {
		currentOrientation = getCurrentOrientation();

		// If `window` is resized due to an orientation change,
		// dispatch `resizeend` immediately; otherwise, slightly delay it
		if (currentOrientation !== initialOrientation) {
			dispatchResizeEndEvent();
			initialOrientation = currentOrientation;
		}
		else {
			clearTimeout(resizeDebounceTimeout);
			resizeDebounceTimeout = setTimeout(dispatchResizeEndEvent, 100);
		}
	}, false);

	$.fn.responsiveLikeBox = function (options) {

		var settings = $.extend({
			initialTimeout: 5,
			loaderSrc: 'img/ajax-loader.gif'
		}, options);

		// Create some defaults
		var defaults = {
			width: this.attr('data-width'),
			height: this.attr('data-height'),
			colorScheme: this.attr('data-colorscheme'),
			showFaces: this.attr('data-show-faces'),
			borderColor: this.attr('data-border-color'),
			showStream: this.attr('data-stream'),
			showHeader: this.attr('data-header')
		};

		// Helpers to use when updating iframe src and data-attrs
		var helpers = {
			translateToUri: {
				width: 'width',
				height: 'height',
				colorScheme: 'colorscheme',
				showFaces: 'show_faces',
				borderColor: 'border_color',
				showStream: 'stream',
				showHeader: 'header'
			},
			translateToDataAttr: {
				width: 'data-width',
				height: 'data-height',
				colorScheme: 'data-colorscheme',
				showFaces: 'data-show-faces',
				borderColor: 'data-border-color',
				showStream: 'data-stream',
				showHeader: 'data-header'
			}
		};

		return this.each(function () {
			// Create the widget object assigning it to the wrapper (witch get the initalizer $().responsiveLikeBox();)
			// settings.initialTimeout = if facebook does'nt respond in 5 tries abort and use HTML implementation
			var widget = this,
				loader;

			// Extend to full object
			widget.init = function () {

				// Show loader on first load
				loader = $('<img class="responsive-lb-loader" src="' + settings.loaderSrc + '" alt="Loading..."/>').appendTo(widget.wrapper.el.parent());
				return $(this).each(function () {
					$(window).bind('load.responsiveLikeBox resizeend.responsiveLikeBox', widget.iframe.resize);
				});
			};

			widget.wrapper = {
				el: $(this),
				apperance: function (el, type) {
					// Hacky replace of quotes in JSON formated CSS
					var data = window.getComputedStyle(el, '::after').content;

					if (data && data != 'none') {
						// Removes first quotes and removes escape char (Opera and FF escapes the quotes) if found
						data = data.substring(1, data.length - 1).replace(/\\/g, '');

						if (type != 'string') {
							// If JSON is'nt correctly formated will throw error here
							try {
								data = $.parseJSON(data);
							}
							catch (e) {
								// Print error in widget
								$('<p class="error-msg">There seem to be a problem with your JSON format in your CSS. The error message says: <strong>' + e.message + '</strong></p>').appendTo(el);
								data = '';
							}
						}
					}
					else {
						if (type != 'string') {
							data = defaults;
						}
						else {
							data = JSON.stringify(defaults);
						}
					}

					return data;
				}
			};

			widget.iframe = {

				apperance: defaults,
				/* Takes the defaults object (the markup implementation unless specified when initalizing) */
				resizing: false,
				resize: function () {

					// Set iframe
					widget.iframe.el = widget.wrapper.el.find('iframe');

					// Iframe load event
					widget.iframe.el.bind('load.responsiveLikeBox', function () {

						// Set iframe apperance to the new apperance
						widget.iframe.apperance = widget.iframe.newApperanceString;

						// Hide loader
						loader.hide();

						// Show iframe
						widget.iframe.el.show();
					});

					// Check wether the src is set yet. Resize depends on it
					if (widget.iframe.el.attr('src')) {

						// Check if styles matches using stringified
						widget.iframe.newApperanceString = widget.wrapper.apperance(widget, 'string');
						if (widget.iframe.apperance != widget.iframe.newApperanceString && !widget.iframe.resizing) {

							widget.iframe.resizing = true;

							// Get apperance as obj
							var newApperance = widget.wrapper.apperance(widget);

							//Change all data in iframe and data-attrs
							var newSrc = widget.iframe.el.attr('src');

							for (var option in newApperance) {
								// Replace data-attrs for all options
								widget.wrapper.el.attr(helpers.translateToDataAttr[option], newApperance[option]);

								// Replace all querysting parameters in ifram src
								// Match on any queryparameter with option name
								var regEx = new RegExp('[?&]' + helpers.translateToUri[option] + '=([a-z0-9%]*)', 'g');

								// Build new queryparameter
								try {
									var query = newSrc.match(regEx).toString();
									newSrc = newSrc.replace(regEx, query.substring(0, 1) + helpers.translateToUri[option] + '=' + window.escape(newApperance[option]));
								}
								catch (e) {
									window.alert('Seems you want to change something you did not specify in your original implementation. If you want to change eg. border-color yo need to specify a border color when you get the code for your fb likebox. Error: ' + e.message);
								}

								// Width and height need more replacements
								if (option === 'width' || option === 'height') {
									// Reset inline styles for wrapping span
									widget.wrapper.el.children('span').css(option, newApperance[option]);

									// Set inline styles for iframe
									widget.iframe.el.css(option, newApperance[option]);
								}

							}

							// Set new src (will make it reload)
							widget.iframe.el.attr('src', newSrc);

							// Show loader and hide iframe while waiting for fb
							loader.show();
							widget.iframe.el.hide();

							widget.iframe.resizing = false;
						}

					}

					// If src is'nt set yet try again
					else {
						if (settings.initialTimeout) {
							// Try in 0.5 seconds
							setTimeout(widget.iframe.resize, 500);
						}
						else {
							loader.hide();
						}

						// One try is used try five times
						settings.initialTimeout--;
					}
				}
			};

			// Runs plugin
			widget.init();

		});
	};

})(jQuery);