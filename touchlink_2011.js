function loadTouchLink()
{
	alert("ready...aim...");
	if(window.jQuery === undefined){
		var head=document.getElementsByTagName('head')[0];
		var script=document.createElement('script');
		script.type='text/Javascript';
		script.src='http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
		script.onload=function(){
			liveBindAnchorsToTouch(jQuery);
		};
		head.appendChild(script);
	}
	else{
			liveBindAnchorsToTouch(jQuery);
	}
}

(function ($) {
	var helper = null,
	link = null,
	startX, 
	leftOffset,
	cancelLinkClick = false,
	underlink = $("<div style='overflow:hidden;color:white;background-color:black;'>The content is here</div>")
		.appendTo("body")
		.hide(),
	getOffsetWithWorkaround = function ($obj) {
		//work around bug in jQuery where offset not calculated when zoomed
		var oldself = self,
		retOffset;
		self = {pageXOffset:0,pageYOffset:0};
		retOffset = $obj.offset();
		self = oldself
		return retOffset;
	},
	start = function (event) {
		var offset,
			e = event.originalEvent;
		//set reference to link
		link = $(this);
		offset = getOffsetWithWorkaround(link);
		startX = offset.left;
		leftOffset = e.touches[0].pageX - startX;
		cancelLinkClick = false;//don't yet need to block from clicking	
	},
	move = function (event) {
			var e = event.originalEvent,
				pageX = e.targetTouches[0].pageX,
				curX = pageX - leftOffset,
				offset, fontSize;
			e.preventDefault();
			if (curX > 5 && !cancelLinkClick && !helper) {
				//we've broken the threshhold, so lets make our helper
				cancelLinkClick = true;
				offset = getOffsetWithWorkaround(link);
				fontSize = link.css("font-size");
				helper = link.clone();
				helper
					.appendTo("body")
					.css({"position": "absolute",
						"display":"block",
						"left":offset.left.toString() + "px",
						"top":offset.top.toString() + "px",
						"background-color": "white",
						"z-index": "20000",
						"font-size": fontSize,
						 "webkit-box-shadow": "-5px 5px 5px rgba(200,200,200,20)"
						})
					.offset(offset);
				//be sure to hide the link once we've created our clone
				link.css("visibility","hidden");
				//set underlink's fontsize to ensure it looks like it should match
				underlink.css("font-size", fontSize);
				underlink.text(this.href);
				underlink.width(1);
				underlink.show();
				underlink.offset(offset);
			}
			if (cancelLinkClick && pageX > startX + leftOffset){
				helper.css("left", function(val){
					return val + curX;
				});
				underlink.width(curX - startX);
			}	
	},
	end = function (event) {
		var e = event.originalEvent;
		if (cancelLinkClick){
			e.preventDefault();
			helper.animate({"left": startX}, 200, function(){
				if (helper) {
					helper.remove();
					helper = null;
					link.css("visibility", "visible");
					link = null;
				}
			});
			underlink.animate({"width":0}, 200, function(){
				underlink.hide();
			});
		}
	};
	//bind all anchors 
	$(document)
		.delegate("a", "touchstart", start)
		.delegate("a", "touchmove", move)
		.delegate("a", "touchend", end);
}(jQuery));