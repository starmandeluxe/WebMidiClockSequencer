/* 
 *  iPhonePicker v1.1.0
 *  A jQuery Plugin that emulates the iPhone UIPickerView control in a browser.
 *
 * Intended for use with the latest jQuery
 *  http://code.jquery.com/jquery-latest.js
 *
 * Copyright 2011, Marino van der Heijden
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *  http://jquery.org/license
 *
 * Date: Monday, August 15th 2011
 *
 *
 * Original derived control:
 *
 * Overscroll v1.4.7
 *  A jQuery Plugin that emulates the iPhone scrolling experience in a browser.
 *  http://azoffdesign.com/overscroll
 *
 * Copyright 2011, Jonathan Azoff
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *  http://jquery.org/license
 *
 * For API documentation, see the README file
 *  https://github.com/azoff/Overscroll/blob/master/README.md
 *
 * Date: Friday, July 15th 2011
 *
 * Also used Control (see below this page): jQuery.ScrollTo
 *  Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 *  Dual licensed under MIT and GPL.
 *  Date: 5/25/2009
 *
 */

/*jslint onevar: true, strict: true */

/*global window, jQuery */

"use strict";

// Height between items (including item content)
var ITEM_OFFSET = parseInt(37);

(function (w, m, $, o) {

	// adds iPhonePicker from a jQuery object
	o = $.fn.iPhonePickerRefresh = function () {
		return this.each(function () {
			if (this.tagName == 'SELECT') {
				o.refresh($(this));
			}
		})
	};

	$.extend(o, {

		// main initialization function
		refresh: function (target) {

			var targetId = target[0].id;
			var selectedIndex = target[0].options.selectedIndex;

			if ($('#uipv_main_' + targetId)[0] != undefined && selectedIndex > 0) {

				var contentId = 'uipv_content_' + targetId;
				var topHeight = m.round(selectedIndex * ITEM_OFFSET)
				$('#'+contentId).scrollTo(topHeight)
			}
		}
	})
})(window, Math, jQuery);


(function (w, $, o) {

	// adds iPhonePicker from a jQuery object
	o = $.fn.iPhonePicker = function (options) {
		options = options || {};
		return this.each(function () {
			if (this.tagName == 'SELECT') {
				o.init($(this), options);
			}
		})
	};

	$.extend(o, {

		// main initialization function
		init: function (target, options) {

			options = $.extend({
				width: '',
				imgRoot: 'http://www.marinovanderheijden.nl/Images/UIPickerView'
			}, options);

			var data = {};
			data.target = target;
			data.options = options;

			data.options.imgRoot = (data.options.imgRoot + '/').replace('\\', '/').replace('//', '/');

			target.css({
				'display': 'none'
			});

			if ($('#uipv_main_' + target[0].id)[0] == undefined) {
				o.addNiftyControl(data);
			} else {
				o.resetControl(data);
			}
		},

		stripSizePostFix: function(size) {
			if (size.length > 2 && size.substring(size.length - 2) == 'px')
				size = size.substring(0, size.length - 2);
			return parseInt(size);
		},

		addNiftyControl: function (data) {
			
			var targetId = data.target[0].id;
			var targetObj = $('#'+targetId);
			var mainId = 'uipv_main_' + targetId;
			var contentId = 'uipv_content_' + targetId;
			var ulId = 'uipv_ul_'+ targetId;

			$('<div/>', {id: mainId}).insertAfter(targetObj);
			$('<div/>', {id: contentId}).appendTo('#'+mainId);
			$('<div/>', {id: 'uipv_left_'+targetId}).appendTo('#'+mainId);
			$('<div/>', {id: 'uipv_top_'+targetId}).appendTo('#'+mainId);
			$('<div/>', {id: 'uipv_right_'+targetId}).appendTo('#'+mainId);
			$('<div/>', {id: 'uipv_bottom_'+targetId}).appendTo('#'+mainId);
			$('<div/>', {id: 'uipv_bar_'+targetId}).appendTo('#'+mainId);

			var controlWidth = (data.options.width == '') 
				? o.stripSizePostFix($('#'+targetId).css('width')) + 12 // Apparently 12 is substracted from the original width. Don't know why?!
				: o.stripSizePostFix(data.options.width);
			if (!(controlWidth >= 20 && controlWidth <= 2000)) {
				controlWidth = 80; // Default value
			} 
			var classAttr = $('#'+targetId).attr('class');
			if (classAttr && classAttr != '') {
				$('#'+mainId).attr('class', classAttr);
			}
			$('#'+mainId).css({
				'width': controlWidth + 'px',
				'height': '160px',
				'position': 'relative',
				'float': 'left'
			});
			$('#'+contentId).css({
				'width': controlWidth-8 + 'px',
				'height': '152px',
				'font-family': 'Arial',
				'font-weight': 'bold',
				'font-size': '11px',
				'z-index': '13',
				'position': 'absolute',
				'float': 'left',
				'margin': '2px 4px 2px 4px',
				'overflow': 'hidden',
				'-webkit-user-select': 'none',
				'-khtml-user-select': 'none',
				'-moz-user-select': 'none',
				'-o-user-select': 'none',
				'user-select': 'none'
			});

			$('#uipv_left_'+targetId).css({
				'width': '4px',
				'height': '160px',
				'background': 'transparent url(' + data.options.imgRoot + 'uipv_left_bg.png) no-repeat top',
				'float': 'left',
				'position': 'absolute',
				'margin': '0px',
				'z-index': '12'
			});
			$('#uipv_top_'+targetId).css({
				'width': controlWidth-8 + 'px',
				'height': '80px',
				'background': 'transparent url(' + data.options.imgRoot + 'uipv_top_bg.png) repeat-x top',
				'float': 'left',
				'position': 'absolute',
				'margin-left': '4px',
				'z-index': '12'
			});
			$('#uipv_bottom_'+targetId).css({
				'width': controlWidth-8 + 'px',
				'height': '80px',
				'background': 'transparent url(' + data.options.imgRoot + 'uipv_bottom_bg.png) repeat-x top',
				'float': 'left',
				'position': 'absolute',
				'margin-top': '80px',
				'margin-left': '4px',
				'z-index': '12'
			});
			$('#uipv_right_'+targetId).css({
				'width': '4px',
				'height': '160px',
				'background': 'transparent url(' + data.options.imgRoot + 'uipv_right_bg.png) no-repeat top', 
				'float': 'right',
				'position': 'absolute',
				'margin-left': controlWidth-4 + 'px',
				'z-index': '12'
			});
			$('#uipv_bar_'+targetId).css({
				'width': controlWidth-8 + 'px',
				'height': '45px',
				'background': 'transparent url(' + data.options.imgRoot + 'uipv_bar_bg.png) repeat-x top',
				'float': 'left',
				'position': 'absolute',
				'margin-top': '58px',
				'margin-left': '4px',
				'z-index': '12'
			});

			// Add div to content for space (margin or padding give errors in Chrome)
			$('<div/>', {id: 'uipv_contenthead_'+targetId}).appendTo('#'+contentId);
			$('#uipv_contenthead_'+targetId).css({
				'height': '61px',
				'width': controlWidth-8 + 'px'
			});
			// <ul> is actual content wrapper
			$('<ul/>', {id: ulId}).appendTo('#'+contentId);
			$('#'+ulId).css({
				'margin': '0px',
				'padding': '0px'
			});
			// Add div to content for space (margin or padding give errors in Chrome)
			$('<div/>', {id: 'uipv_contentfoot_'+targetId}).appendTo('#'+contentId);
			$('#uipv_contentfoot_'+targetId).css({
				'height': '54px',
				'width': controlWidth-8 + 'px'
			});

			// Deny selecting text in options
			o.selectable($('#'+contentId)[0], false);

			if (data.target[0].options.length > 0) {
				for(var i=0;i<data.target[0].options.length;i++) {
					var option = data.target[0].options[i];
					$('<li/>', {id: ulId+'_'+option.value, value: option.value, text: option.text}).appendTo('#'+ulId);
					$('#'+ulId+'_'+option.value).css({
						'height': '37px',
						'line-height': '37px',
						'text-align': 'center',
						'display': 'block',
						'padding': '0px',
						'margin': '0px'
					});
				}

				$('#'+contentId).iPhonePickerOverscroll({
					selectedIndex: data.target[0].options.selectedIndex, 
					parentId: targetId, 
					itemCount: data.target[0].options.length});
			}
		},

		setStyle: function(element, property, value) {
			property = property.replace(/-(\w)/g, function(match, letter) {
				return letter.toUpperCase();
			});
			if (element.style[property]) {
				element.style[property] = value;
			}
		},

		selectable: function(element, bool) {
			// most browsers:
			o.setStyle(element, 'user-select', bool ? '' : 'none');
			o.setStyle(element, '-moz-user-select', bool ? '' : 'none');
			o.setStyle(element, '-khtml-user-select', bool ? '' : 'none');
		
			// IE:
			element.onselectstart = bool ? null : function() { return false; };
		
			// IE and Opera:
			element.setAttribute('unselectable', bool ? '' : 'on', 0);
		}

	})
})(window, jQuery);


(function (w, m, $, o) {

	// adds overscroll from a jQuery object
	o = $.fn.iPhonePickerOverscroll = function (options) {
		options = options || {};
		return this.each(function () {
			o.init($(this), options);
		});
	};

	// removes overscroll from a jQuery object
	$.fn.removeIPhonePickerOverscroll = function (options) {
		return this.each(function () {
			var remover = $(this).data(o.removerKey);
			if ($.isFunction(remover)) {
				remover();
			}
		});
	};

	$.extend(o, {

		// events handled by overscroll
		events: {
			wheel: "mousewheel DOMMouseScroll",
			start: "select mousedown touchstart",
			drag: "mousemove touchmove",
			end: "mouseup mouseleave touchend",
			ignored: "dragstart drag",
			click: "click"
		},

		// to save a couple bits
		div: '<div/>',
		removerKey: 'overscroll-remover',
		data: {},

		// constants used to tune scroll-ability and thumbs
		constants: {
			driftFrequency: 40,
			// 20 FPS
			driftSequences: 22,
			driftDecay: 1.25,
			driftTimeout: 100,
			timeout: 400,
			captureThreshold: 3,
			wheelDelta: 37,
			scrollDelta: 25,
			thumbThickness: 6,
			thumbOpacity: 0.7,
			topOffset: 62,
			textSize: 11
		},

		checkIosDevice: function () {
			if (o.isIOS === undefined) {
				o.isIOS = /iP((hone)|(ad)|(od))/.test(navigator.platform);
			}
			return o.isIOS;
		},

		// main initialization function
		init: function (target, options) {

			o.data = {
				sizing: o.getSizing(target)
			};

			options = $.extend({
				selectedIndex: 0,
				parentId: '',
				itemCount: 0,
				showThumbs: false,
				wheelDirection: 'vertical',
				cursor: 'pointer',
				wheelDelta: o.constants.wheelDelta,
				scrollDelta: o.constants.scrollDelta,
				direction: 'multi',
				cancelOn: '',
				reset: false
			}, options);

			// check for inconsistent directional restrictions
			if (options.direction !== 'multi' && options.direction !== options.wheelDirection) {
				options.wheelDirection = options.direction;
			}

			options.scrollDelta = m.abs(options.scrollDelta);
			options.wheelDelta = m.abs(options.wheelDelta);

			target.css({
				'position': 'absolute',
				'overflow': 'hidden',
				'cursor': options.cursor
			});

			if (!options.reset) {
				// remove any old bindings and set up a deconstructor
				target.removeIPhonePickerOverscroll();
				target.data(o.removerKey, o.remover(target));

				target.bind(o.events.wheel, o.data, o.wheel)
					.bind(o.events.start, o.data, o.start)
					.bind(o.events.end, o.data, o.stop)
					.bind(o.events.ignored, false);

				// disable proprietary drag handlers
				if (options.showThumbs) {

					o.data.thumbs = {};

					if (o.data.sizing.container.scrollWidth > 0 && options.direction !== 'vertical') {
						o.data.thumbs.horizontal = $(o.div).css(o.getThumbCss(o.data.sizing.thumbs.horizontal)).fadeTo(0, 0);
						target.prepend(o.data.thumbs.horizontal);
					}

					if (o.data.sizing.container.scrollHeight > 0 && options.direction !== 'horizontal') {
						o.data.thumbs.vertical = $(o.div).css(o.getThumbCss(o.data.sizing.thumbs.vertical)).fadeTo(0, 0);
						target.prepend(o.data.thumbs.vertical);
					}

				};
			}

			o.data.target = target;
			o.data.options = options;

			if (options.selectedIndex > 0) {
				o.scrollToIndex(o.data, options.selectedIndex, true);
			}

		},

		remover: function (target) {
			return function () {
				target.css({
					overflow: 'auto',
					cursor: 'default'
				}).unbind(o.events.wheel, o.wheel)
				.unbind(o.events.start, o.data, o.start)
				.unbind(o.events.end, o.data, o.stop)
				.unbind(o.events.ignored, false)
				.unbind(o.events.click, o.data, o.click);
				if (o.data.thumbs) {
					if (o.data.thumbs.horizontal) {
						o.data.thumbs.horizontal.remove();
					}
					if (o.data.thumbs.vertical) {
						o.data.thumbs.vertical.remove();
					}
				}
			};
		},

		triggerEvent: function (event) {
			o.data.target.trigger('overscroll:' + event);
		},

		// toggles the drag mode of the target
		toggleThumbs: function (eventData, dragging) {
			if (eventData.thumbs) {
				if (dragging) {
					if (eventData.thumbs.vertical) {
						eventData.thumbs.vertical.stop(true, true).fadeTo("fast", o.constants.thumbOpacity);
					}
					if (eventData.thumbs.horizontal) {
						eventData.thumbs.horizontal.stop(true, true).fadeTo("fast", o.constants.thumbOpacity);
					}
				} else {
					if (eventData.thumbs.vertical) {
						eventData.thumbs.vertical.fadeTo("fast", 0);
					}
					if (eventData.thumbs.horizontal) {
						eventData.thumbs.horizontal.fadeTo("fast", 0);
					}
				
					var index = o.selectedIndex(eventData.target[0]);
					o.scrollToIndex(eventData, index);
				}
			}
		},

		scrollToIndex: function(eventData, index, isInit) {
			if (index == 'undefined' || index == null) {
				index = eventData.options.selectedIndex;
			}
			var topOffset = m.round(index * ITEM_OFFSET);
			$(eventData.target[0]).scrollTo(topOffset);
			if (!isInit && !eventData.options.reset) {
				o.setValue(eventData);
			}
		},

		setValue: function(data) {
			if (data == null)
				data = o.data;
			// Get selected item index
			var index = (data.options.reset) ? data.options.selectedIndex : o.selectedIndex(data.target[0]);
			// Set selected item in targeted object
			jQuery("select#"+data.options.parentId+" option[selected]").removeAttr("selected");
			jQuery("select#"+data.options.parentId+" option[index=" + index + "]").attr("selected", "selected");
			
			if (!data.options.reset) {
				// Trigger onchange event manually
				$('#'+data.options.parentId).trigger(jQuery.Event('change'));
			}
		},

		selectedIndex: function(target) {
			var index = Math.round(target.scrollTop/ITEM_OFFSET);
			return index;
		},

		// sets a position object
		setPosition: function (event, position, index) {
			position.x = event.pageX;
			position.y = event.pageY;
			position.time = o.time();
			position.index = index;
			return position;
		},

		// handles mouse wheel scroll events
		wheel: function (event, delta) {

			o.clearInterval(event.data.target);

			if (event.wheelDelta) {
				delta = event.wheelDelta / (w.opera ? - 120 : 120);
			}

			if (event.detail) {
				delta = -event.detail / 3;
			}

			if (!event.data.wheelCapture) {
				event.data.wheelCapture = {
					timeout: null
				};
				o.toggleThumbs(event.data, true);
				event.data.target.stop(true, true).data('dragging', true);
			}

			delta *= event.data.options.wheelDelta;

			if (event.data.options.wheelDirection === 'horizontal') {
				this.scrollLeft -= delta;
			} else {
				this.scrollTop -= delta;
			}

			o.moveThumbs(event, this.scrollLeft, this.scrollTop);

			if (event.data.wheelCapture.timeout) {
				clearTimeout(event.data.wheelCapture.timeout);
			}

			event.data.wheelCapture.timeout = setTimeout(function (d) {
				event.data.wheelCapture = undefined;
				o.toggleThumbs(event.data, false);
				event.data.target.data('dragging', false);
			}, o.constants.timeout);

			if(!event){ event = window.event; } /* IE7, IE8, Chrome, Safari */
			if(event.preventDefault) { event.preventDefault(); } /* Chrome, Safari, Firefox */
			event.returnValue = false; /* IE7, IE8 */

			o.setValue(event.data); 
		},

		// handles a scroll event
		moveThumbs: function (event, left, top, thumbs, sizing, ml, mt) {

			if (event.data.options.showThumbs) {

				thumbs = event.data.thumbs;
				sizing = event.data.sizing;

				if (thumbs.horizontal) {
					ml = left * (1 + sizing.container.width / sizing.container.scrollWidth);
					mt = top + sizing.thumbs.horizontal.top;
					thumbs.horizontal.css("margin", mt + "px 0 0 " + ml + "px");
				}

				if (thumbs.vertical) {
					ml = left + sizing.thumbs.vertical.left;
					mt = top * (1 + sizing.container.height / sizing.container.scrollHeight);
					thumbs.vertical.css("margin", mt + "px 0 0 " + ml + "px");
				}
			}
		},

		// click on the control to scroll up or down
		click: function (event, obj) {

			o.clearInterval(event.data.target);

			var yPos = event.pageY - $(obj).offset().top;

			if (yPos < 60 || yPos > 105) {

				// Not clicked on the middle bar so continue!
				var upClick = (yPos < 60);
				var selIndex = o.selectedIndex(event.data.target[0]);

				if ((upClick && selIndex > 0) || (!upClick && selIndex < event.data.options.itemCount - 1)) {

					// List has item to scroll to
					var newIndex = (upClick) ? selIndex - 1 : selIndex + 1;

					// Simulate drift location
					event.data.position = o.setPosition(event, {});
					event.data.capture = o.setPosition(event, {}, 2);
					event.data.capture.y += (upClick) ? -6 : 8;

					o.drift(obj, event, function (data) {
						data.target.data('dragging', false);
						o.toggleThumbs(data, false);
						o.scrollToIndex(event.data, newIndex);
					});
				}
			}
		},

		// starts the drag operation and binds the mouse move handler
		start: function (event) {

			o.clearInterval(event.data.target);

			event.data.startTarget = $(event.target);

			if (!event.data.startTarget.is(event.data.options.cancelOn)) {
				o.normalizeEvent(event);
				event.data.target.bind(o.events.drag, event.data, o.drag).stop(true, true).data('dragging', false).data('dragged', false);
				event.data.position = o.setPosition(event, {});
				event.data.capture = o.setPosition(event, {}, 2);
				o.triggerEvent('dragstart', event.data);
			}

		},

		// updates the current scroll location during a mouse move
		drag: function (event, ml, mt, left, top) {

			o.normalizeEvent(event);

			event.data.target.data('dragged', true);

			if (!event.data.target.data('dragging')) {
				o.toggleThumbs(event.data, true);
			}

			if (event.data.options.direction !== 'vertical') {
				this.scrollLeft -= (event.pageX - event.data.position.x);
			}

			if (event.data.options.direction !== 'horizontal') {
				this.scrollTop -= (event.pageY - event.data.position.y);
			}

			o.moveThumbs(event, this.scrollLeft, this.scrollTop);

			o.setPosition(event, event.data.position);

			if (--event.data.capture.index <= 0) {
				event.data.target.data('dragging', true);
				o.setPosition(event, event.data.capture, o.constants.captureThreshold);
			}

		},

		normalizeEvent: function (event) {
			if (o.checkIosDevice()) {
				var iosEvent = event.originalEvent.changedTouches[0];
				event.pageX = iosEvent.pageX;
				event.pageY = iosEvent.pageY;
			}
		},

		time: function () {
			return (new Date()).getTime();
		},

		// defers target click event's for one iteration
		deferClick: function (target) {
			var events = target.data('events');
			if (events && events.click && events.click.length) {
				events = events.click.slice();
				target.unbind('click').one('click', function (event) {
					event.preventDefault();
					$.each(events, function (i, event) {
						target.click(event);
					});
				});
			}
		},

		// ends the drag operation and unbinds the mouse move handler
		stop: function (event, dx, dy, d) {

			if (event.data.position) {

				event.data.target.unbind(o.events.drag, o.drag);

				o.triggerEvent('dragend', event.data);

				if (event.data.target.data('dragging')) {
					o.drift(this, event, function (data) {
						data.target.data('dragging', false);
						o.toggleThumbs(data, false);
						var index = o.selectedIndex(event.data.target[0]);
						o.scrollToIndex(event.data, index);
					});
				} else if (event.data.target.data('dragged')) {
					o.toggleThumbs(event.data, false);
					//event.data.target.data('dragged', false);
				} else {
					o.click(event, this);
				}

				// only if we moved, and the mouse down is the same as
				// the mouse up target do we defer the event
				if (event.data.target.data('dragged') && $(event.target).is(event.data.startTarget)) {
					event.data.target.data('dragged', false);
					o.deferClick(event.data.startTarget);
					event.data.startTarget = null;
				} 

				event.data.capture = event.data.position = undefined;
			}

		},

		clearInterval: function (target) {
			target = $(target);
			var interval = target.data('overscroll-interval');
			if (interval) {
				w.clearInterval(interval);
			}
			target.data('overscroll-interval', null);
		},

		setInterval: function (target, interval) {
			o.clearInterval(target);
			$(target).data('overscroll-interval', interval);
		},

		// sends the overscrolled element into a drift
		drift: function (target, event, callback) {

			// only drift on intended drifts
			if ((o.time() - event.data.capture.time) > o.constants.driftTimeout) {
				return callback.call(null, event.data);
			}

			o.normalizeEvent(event);

			var dx = event.data.options.scrollDelta * (event.pageX - event.data.capture.x),
				dy = event.data.options.scrollDelta * (event.pageY - event.data.capture.y),
				scrollLeft = target.scrollLeft,
				scrollTop = target.scrollTop,
				xMod = dx / o.constants.driftSequences,
				yMod = dy / o.constants.driftSequences,
				decay = o.constants.driftDecay;

			if (event.data.options.direction !== 'vertical') {
				scrollLeft -= dx;
			}

			if (event.data.options.direction !== 'horizontal') {
				scrollTop -= dy;
			}

			o.triggerEvent('driftstart', event.data);

			o.setInterval(target, w.setInterval(function () {

				var done = true,
					min = 1,
					max = -1;

				if (yMod > min && target.scrollTop > scrollTop || yMod < max && target.scrollTop < scrollTop) {
					done = false;
					target.scrollTop -= yMod;
					yMod /= decay;
				}

				if (xMod > min && target.scrollLeft > scrollLeft || xMod < max && target.scrollLeft < scrollLeft) {
					done = false;
					target.scrollLeft -= xMod;
					xMod /= decay;
				}

				o.moveThumbs(event, target.scrollLeft, target.scrollTop);

				if (done) {
					o.clearInterval(target);
					o.triggerEvent('driftend', event.data);
					callback.call(null, event.data);
				}

			}, o.constants.driftFrequency));

		},

		// gets sizing for the container and thumbs
		getSizing: function (container) {

			var sizing = {}, parent = container.get(0);

			sizing.container = {
				width: container.width(),
				height: container.height()
			};

			sizing.container.scrollWidth = (parent.scrollWidth == sizing.container.width ? 0 : parent.scrollWidth);
			sizing.container.scrollHeight = (parent.scrollHeight == sizing.container.height ? 0 : parent.scrollHeight);

			sizing.thumbs = {
				horizontal: {
					width: sizing.container.width * sizing.container.width / sizing.container.scrollWidth,
					height: o.constants.thumbThickness,
					corner: o.constants.thumbThickness / 2,
					left: 0,
					top: sizing.container.height - o.constants.thumbThickness
				},
				vertical: {
					width: o.constants.thumbThickness,
					height: sizing.container.height * sizing.container.height / sizing.container.scrollHeight,
					corner: o.constants.thumbThickness / 2,
					left: sizing.container.width - o.constants.thumbThickness,
					top: 0
				}
			};

			return sizing;

		},

		// gets the CSS object for a thumb
		getThumbCss: function (size) {

			return {
				'position': 'absolute',
				'background-color': 'black',
				'width': size.width + 'px',
				'height': size.height + 'px',
				'margin': size.top + 'px 0 0 ' + size.left + 'px',
				'-moz-border-radius': size.corner + 'px',
				'-webkit-border-radius': size.corner + 'px',
				'border-radius': size.corner + 'px',
				'z-index': '1'
			};

		}

	});

})(window, Math, jQuery);


/**
* jQuery.ScrollTo
* Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
* Dual licensed under MIT and GPL.
* Date: 5/25/2009
*
* @projectDescription Easy element scrolling using jQuery.
* http://flesler.blogspot.com/2007/10/jqueryscrollto.html
* Works with jQuery +1.2.6. Tested on FF 2/3, IE 6/7/8, Opera 9.5/6, Safari 3, Chrome 1 on WinXP.
*
* @author Ariel Flesler
* @version 1.4.2
*
* @id jQuery.scrollTo
* @id jQuery.fn.scrollTo
* @param {String, Number, DOMElement, jQuery, Object} target Where to scroll the matched elements.
*	  The different options for target are:
*		- A number position (will be applied to all axes).
*		- A string position ('44', '100px', '+=90', etc ) will be applied to all axes
*		- A jQuery/DOM element ( logically, child of the element to scroll )
*		- A string selector, that will be relative to the element to scroll ( 'li:eq(2)', etc )
*		- A hash { top:x, left:y }, x and y can be any kind of number/string like above.
*		- A percentage of the container's dimension/s, for example: 50% to go to the middle.
*		- The string 'max' for go-to-end. 
* @param {Number} duration The OVERALL length of the animation, this argument can be the settings object instead.
* @param {Object,Function} settings Optional set of settings or the onAfter callback.
*	 @option {String} axis Which axis must be scrolled, use 'x', 'y', 'xy' or 'yx'.
*	 @option {Number} duration The OVERALL length of the animation.
*	 @option {String} easing The easing method for the animation.
*	 @option {Boolean} margin If true, the margin of the target element will be deducted from the final position.
*	 @option {Object, Number} offset Add/deduct from the end position. One number for both axes or { top:x, left:y }.
*	 @option {Object, Number} over Add/deduct the height/width multiplied by 'over', can be { top:x, left:y } when using both axes.
*	 @option {Boolean} queue If true, and both axis are given, the 2nd axis will only be animated after the first one ends.
*	 @option {Function} onAfter Function to be called after the scrolling ends. 
*	 @option {Function} onAfterFirst If queuing is activated, this function will be called after the first scrolling ends.
* @return {jQuery} Returns the same jQuery object, for chaining.
*
* @desc Scroll to a fixed position
* @example $('div').scrollTo( 340 );
*
* @desc Scroll relatively to the actual position
* @example $('div').scrollTo( '+=340px', { axis:'y' } );
*
* @dec Scroll using a selector (relative to the scrolled element)
* @example $('div').scrollTo( 'p.paragraph:eq(2)', 500, { easing:'swing', queue:true, axis:'xy' } );
*
* @ Scroll to a DOM element (same for jQuery object)
* @example var second_child = document.getElementById('container').firstChild.nextSibling;
*			$('#container').scrollTo( second_child, { duration:500, axis:'x', onAfter:function(){
*				alert('scrolled!!');																   
*			}});
*
* @desc Scroll on both axes, to different values
* @example $('div').scrollTo( { top: 300, left:'+=200' }, { axis:'xy', offset:-20 } );
*/
; (function ($) {

	var $scrollTo = $.scrollTo = function (target, duration, settings) {
		$(window).scrollTo(target, duration, settings);
	};

	$scrollTo.defaults = {
		axis: 'xy',
		duration: parseFloat($.fn.jquery) >= 1.3 ? 0 : 1
	};

	// Returns the element that needs to be animated to scroll the window.
	// Kept for backwards compatibility (specially for localScroll & serialScroll)
	$scrollTo.window = function (scope) {
		return $(window)._scrollable();
	};

	// Hack, hack, hack :)
	// Returns the real elements to scroll (supports window/iframes, documents and regular nodes)
	$.fn._scrollable = function () {
		return this.map(function () {
			var elem = this,
				isWin = !elem.nodeName || $.inArray(elem.nodeName.toLowerCase(), ['iframe', '#document', 'html', 'body']) != -1;

			if (!isWin)
				return elem;

			var doc = (elem.contentWindow || elem).document || elem.ownerDocument || elem;

			return $.browser.safari || doc.compatMode == 'BackCompat' ?
				doc.body :
				doc.documentElement;
		});
	};

	$.fn.scrollTo = function (target, duration, settings) {
		if (typeof duration == 'object') {
			settings = duration;
			duration = 0;
		}
		if (typeof settings == 'function')
			settings = { onAfter: settings };

		if (target == 'max')
			target = 9e9;

		settings = $.extend({}, $scrollTo.defaults, settings);
		// Speed is still recognized for backwards compatibility
		duration = duration || settings.speed || settings.duration;
		// Make sure the settings are given right
		settings.queue = settings.queue && settings.axis.length > 1;

		if (settings.queue)
		// Let's keep the overall duration
			duration /= 2;
		settings.offset = both(settings.offset);
		settings.over = both(settings.over);

		return this._scrollable().each(function () {
			var elem = this,
				$elem = $(elem),
				targ = target, toff, attr = {},
				win = $elem.is('html,body');

			switch (typeof targ) {
				// A number will pass the regex 
				case 'number':
				case 'string':
					if (/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(targ)) {
						targ = both(targ);
						// We are done
						break;
					}
					// Relative selector, no break!
					targ = $(targ, this);
				case 'object':
					// DOMElement / jQuery
					if (targ.is || targ.style)
					// Get the real position of the target 
						toff = (targ = $(targ)).offset();
			}
			$.each(settings.axis.split(''), function (i, axis) {
				var Pos = axis == 'x' ? 'Left' : 'Top',
					pos = Pos.toLowerCase(),
					key = 'scroll' + Pos,
					old = elem[key],
					max = $scrollTo.max(elem, axis);

				if (toff) {// jQuery / DOMElement
					attr[key] = toff[pos] + (win ? 0 : old - $elem.offset()[pos]);

					// If it's a dom element, reduce the margin
					if (settings.margin) {
						attr[key] -= parseInt(targ.css('margin' + Pos)) || 0;
						attr[key] -= parseInt(targ.css('border' + Pos + 'Width')) || 0;
					}

					attr[key] += settings.offset[pos] || 0;

					if (settings.over[pos])
					// Scroll to a fraction of its width/height
						attr[key] += targ[axis == 'x' ? 'width' : 'height']() * settings.over[pos];
				} else {
					var val = targ[pos];
					// Handle percentage values
					attr[key] = val.slice && val.slice(-1) == '%' ?
						parseFloat(val) / 100 * max
						: val;
				}

				// Number or 'number'
				if (/^\d+$/.test(attr[key]))
				// Check the limits
					attr[key] = attr[key] <= 0 ? 0 : Math.min(attr[key], max);

				// Queueing axes
				if (!i && settings.queue) {
					// Don't waste time animating, if there's no need.
					if (old != attr[key])
					// Intermediate animation
						animate(settings.onAfterFirst);
					// Don't animate this axis again in the next iteration.
					delete attr[key];
				}
			});

			animate(settings.onAfter);

			function animate(callback) {
				$elem.animate(attr, duration, settings.easing, callback && function () {
					callback.call(this, target, settings);
				});
			};

		}).end();
	};

	// Max scrolling position, works on quirks mode
	// It only fails (not too badly) on IE, quirks mode.
	$scrollTo.max = function (elem, axis) {
		var Dim = axis == 'x' ? 'Width' : 'Height',
			scroll = 'scroll' + Dim;

		if (!$(elem).is('html,body'))
			return elem[scroll] - $(elem)[Dim.toLowerCase()]();

		var size = 'client' + Dim,
			html = elem.ownerDocument.documentElement,
			body = elem.ownerDocument.body;

		return Math.max(html[scroll], body[scroll])
			 - Math.min(html[size], body[size]);

	};

	function both(val) {
		return typeof val == 'object' ? val : { top: val, left: val };
	};

})(jQuery);