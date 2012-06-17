# Responsive Facebook Like Box

This jQuery plugin makes it possible to update an 'regular' Facebook Like Box's specification without reloading the page. It is used in conjunction with media queries in your CSS wich makes it convinient and easy to use along with a responsive workflow.



## Usage


### Include the script into your page
The script depends on jQuery, you must include a version of jQuery.

	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	<script src="js/responsive-like-box.js"></script>
	
	
### Make a regular Facebook Like Box implementation.
Use the HTML5 alternative. All properties you want to fiddle with you need to include/specify. If you for example want to change the borderColor in a @media only screen and(min-width: 600px) you need to specify a borderColor in the original implementation. You will find the [Facebook Like Box](http://developers.facebook.com/docs/reference/plugins/like-box/) on Facebook Developers.

Facebook Like Box implementation consists of two parts. It might look like this:

	<div id="fb-root"></div>
	<script>(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); js.id = id;
	  js.src = "//connect.facebook.net/sv_SE/all.js#xfbml=1";
	  fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));</script>

	...
	
	<div class="fb-like-box" 
		data-href="http://www.facebook.com/platform" 
		data-width="318" 
		data-height="300" 
		data-colorscheme="light" 
		data-show-faces="true" 
		data-border-color="#eeeeee" 
		data-stream="false" 
		data-header="false">
	</div>


### Initialize the script
To enable the script you need to initialize it. This is the simplest way to do that.

	$('.fb-like-box').responsiveLikeBox();
	
You can also pass a options object in the initialization. There are two avalible options:

* `initialTimeout` wich specifies the amount of times the plugin will try to aquire the facebook widget before it will timeout and fallback to original implementation.
* `loaderSrc` wich specifies the path to the loader .gif relative to the responsive-like-box.js file.

Example of options usage:

	$('.fb-like-box').responsiveLikeBox({
		initialTimeout : 5,
		loaderSrc : '../img/loader.gif'
	});


### Use the ::after pseudo element to specify changes

The plugin will look for a JSON string in the `::after` pseudo element of the Like Box div. You pass you settings in the `content` rule. You can't use new-line chars in the JSON string. All options you have in the original implementation is possible to use/change.

	@media only screen and (min-width: 600px) {
		
		.fb-like-box::after {
			content: '{ "width" : "600", "height" : "618", "colorScheme" : "dark", "showFaces" : "true", "borderColor" : "#555", "showStream" : "true", "showHeader" : "false" }';
			display: none;
		}
	}