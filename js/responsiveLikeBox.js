var widget = {
	iframe : {
		style : '',
		resize : function (widget) {
		},
		$domElem : $('.fb-like-box iframe')
	},
	wrapper : {
		style : JSON.parse(window.getComputedStyle(this.$domElem, '::after').content),
		$domElem : $('.fb-like-box')
	}
}

window.addEventListner('resize', function () {
	if(widget.iframe.style != widget.wrapper.style){
		widget.iframe.resize(widget);
	}
})