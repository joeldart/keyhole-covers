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

function liveBindAnchorsToTouch($){
	alert("hello world!");
	var helper = null;//is probably a jquery object but testing will learn for sure
	var link = null;//will be a wrapped jquery object of the original this 
	var startX = -1, leftOffset = -1;
	var cancelLinkClick = false;
	underlink = $("<div id='underlink' style='overflow:hidden;color:white;background-color:black;'>The content is here</div>")
		.appendTo("body")
		.hide();
			$("a").live(
		"touchstart",function(event){
			//lets start by only handing first touch
			var e = event.originalEvent;
			link = $(this);
			//can't prevent default here or it will never click the link
			//e.preventDefault();//need to block it from scrolling
			var oldself = self;
			self = {pageXOffset:0,pageYOffset:0};
			var offset = link.offset();
			startX = offset.left;
			self = oldself;
			leftOffset = e.touches[0].pageX - startX;
			cancelLinkClick = false;//don't yet need to block from clicking
		})
		.live("touchmove",function(event){
			var e = event.originalEvent;
			e.preventDefault();
			var pageX = e.targetTouches[0].pageX;
			curX = pageX - leftOffset;
			if(curX > 5 && !cancelLinkClick){
				//we've broken the threshhold, so lets make our 
				//helper
				cancelLinkClick = true;
				var oldself = self;
				self = {pageXOffset:0,pageYOffset:0};
				var offset = link.offset();
				var fontSize = link.css("font-size");
				helper = link.clone();
					helper
					.appendTo("body")
					.css({"position": "absolute",
						"display":"block",
						"left":offset.left.toString() + "px",
						"top":offset.top.toString() + "px",
						"background-color":"white",
						"z-index": "20000",
						"font-size": fontSize,
						 "webkit-box-shadow": "-5px 5px 5px rgba(200,200,200,20)"
						})
					.offset(link.offset());
				link.css("visibility","hidden");
				underlink.css("font-size",fontSize);//set underlink's fontsize to ensure it looks like it should match
				underlink.text(this.href);
				underlink.width(1);
				underlink.show();
				underlink.offset(offset);
				self = oldself;	
			}
			if(cancelLinkClick && pageX > startX + leftOffset){
				helper.css("left", function(val){
						return val + curX;
				});
				underlink.width(curX - startX);
			}
		})
		.live("touchend", function(event){
			event.preventDefault();
			var e = event.originalEvent;
			if(cancelLinkClick){
				e.preventDefault();
//					console.log("default prevented!");
				helper.animate({"left": startX}, 200, function(){
					if(helper != null){
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
		});
}

//duplicated code for testing
//original code used bind, then I remembered live, so I copy/pasted since live doesn't
//have the sweet object syntax of bind
function bindAnchorsToTouch(){			
	var helper = null;//is probably a jquery object but testing will learn for sure
	var link = null;//will be a wrapped jquery object of the original this 
	var startX = -1, leftOffset = -1;
	var cancelLinkClick = false;
	underlink = $("<div id='underlink' style='overflow:hidden;background-color:white;'>The content is here</div>")
		.appendTo("body")
		.hide();
	$("a").bind({
		"touchstart": function(event){
			//lets start by only handing first touch
			var e = event.originalEvent;
			link = $(this);
			//can't prevent default here or it will never click the link
			//e.preventDefault();//need to block it from scrolling
			var oldself = self;
			self = {pageXOffset:0,pageYOffset:0};
			var offset = link.offset();
			startX = offset.left;
			self = oldself;
			leftOffset = e.touches[0].pageX - startX;
			cancelLinkClick = false;//don't yet need to block from clicking
		},
		"touchmove": function(event){
			var e = event.originalEvent;
			e.preventDefault();
			var pageX = e.targetTouches[0].pageX;
			curX = pageX - leftOffset;
			if(curX > 5 && !cancelLinkClick){
				cancelLinkClick = true;
				var oldself = self;
				self = {pageXOffset:0,pageYOffset:0};
				var offset = link.offset();
				helper = link.clone();
					helper
					.appendTo("body")
					.css({"position": "absolute",
						"display":"block",
						"left":offset.left.toString() + "px",
						"top":offset.top.toString() + "px",
						"background-color":"white",
						"z-index": "20000"
						})
					.offset(link.offset());
				link.css("visibility", "hidden");
				underlink.text(this.href);
				underlink.width(1);
				underlink.show();
				underlink.offset(offset);
				self = oldself;	
			}
			if(cancelLinkClick && pageX > startX + leftOffset){
				helper.css("left", function(val){
						return val + curX;
				});
				underlink.width(curX - startX);
			}
		},
		"touchend": function(event){
		console.log("touch end");
			event.preventDefault();
			var e = event.originalEvent;
			if(cancelLinkClick){
				e.preventDefault();
//					console.log("default prevented!");
				helper.animate({"left": startX}, 200, function(){
					if(helper != null){
						helper.remove();
						helper = null;
						link.css("visibility", "visible");
						link = null;
						underlink.hide();
					}
				});
			}
		}
	});
}