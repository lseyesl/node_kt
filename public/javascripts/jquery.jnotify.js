/*!
 * jNotify jQuery Plug-in
 *
 * Copyright 2013 Giva, Inc. (http://www.givainc.com/labs/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Date: 2014-07-10
 * Rev:  1.2.00
 */
;(function($){
	$.jnotify = function (m, o, d){
		return new jNotify(m, o, d);
	};

	// set the version of the plug-in
	$.jnotify.version = "1.2.00";

	var $jnotify, queue = [], idx = 0, playing = false, paused = false, queuedId,
		// define default settings
		defaults = {
			// define core settings
			  type: ""                                  // if a type is specified, then an additional class of classNotification + type is created for each notification
			, delay: 2000                               // the default time to show each notification (in milliseconds)
			, sticky: false                             // determines if the message should be considered "sticky" (user must manually close notification)
			, clickToDismiss: true                      // allows you to click on a message to dismiss it
			, closeLabel: "&times;"                     // the HTML to use for the "Close" link
			, showClose: true                           // determines if the "Close" link should be shown if notification is also sticky
			, fadeSpeed: 1000                           // the speed to fade messages out (in milliseconds)
			, slideSpeed: 250                           // the speed used to slide messages out (in milliseconds)

			// define the class statements
			, classContainer: "jnotify-container"       // className to use for the outer most container--this is where all the notifications appear
			, classNotification: "jnotify-notification" // className of the individual notification containers
			, classDismissible: "jnotify-dismissible"   // className to use for dismissible notifications
			, classBackground: "jnotify-background"     // className of the background layer for each notification container
			, classClose: "jnotify-close"               // className to use for the "Close" link
			, classMessage: "jnotify-message"           // className to use for the actual notification text container--this is where the message is actually written

			// event handlers
			, init: null                                // callback that occurs when the main jnotify container is created
			, create: null                              // callback that occurs when when the note is created (occurs just before appearing in DOM)
			, beforeRemove: null                        // callback that occurs when before the notification starts to fade away
			, remove: null                              // callback that occurs when notification is removed
			, transition: null                          // allows you to overwrite how the transitions between messages are handled
			                                            // receives the following arguments:
			                                            //   container - jQuery object containing the notification
			                                            //   message   - jQuery object of the actual message
			                                            //   count     - the number of items left in queue
			                                            //   callback  - a function you must execute once your transition has executed
			                                            //   options   - the options used for this jnotify instance
		};

	// override the defaults
	$.jnotify.setup = function (o){
		defaults = $.extend({}, defaults, o) ;
	};

	$.jnotify.play = function (f, d){
		if( playing && (f !== true ) || (queue.length == 0) ) return;
		playing = true;

		// get first note
		var note = queue[0];

		// determine delay to use
		var delay = (arguments.length >= 2) ? parseInt(d, 10) : note.options.delay;

		// run delay before removing message
		queuedId = setTimeout(function(){
			// clear timeout id
			queuedId = 0;
			note.remove(function (){
				// mark that the queue is empty
				if( queue.length == 0 ) playing = false;
				// force playing the next item in queue
				else if( !paused ) $.jnotify.play(true);
			});
		}, delay);
	};

	$.jnotify.pause = function(){
		clearTimeout(queuedId);
		// push the item back into the queue
		// mark that we're playing (so it doesn't automatically start playing)
		paused = playing = true;
  }

	$.jnotify.resume = function(){
		// mark that we're no longer pause
		paused = false;

		// resume playing
		$.jnotify.play(true, 0);
  }

	function delegateEvent($el, events, selector, handler){
		if( "delegate" in jQuery.fn  ){
			$el.delegate(selector, events, handler);
		} else {
			$el.on(events, selector, handler);
		}
	}


	function jNotify(message, options){
		// a reference to the jNotify object
		var self = this, TO = typeof options;

		if( TO == "number" ){
			options = $.extend({}, defaults, {delay: options});
		} else if( TO == "boolean" ){
			options = $.extend({}, defaults, {sticky: true}) ;
		} else if( TO == "string" ){
			options = $.extend({}, defaults, {type: options, delay: ((arguments.length > 2) && (typeof arguments[2] == "number")) ? arguments[2] : defaults.delay, sticky: ((arguments.length > 2) && (typeof arguments[2] == "boolean")) ? arguments[2] : defaults.sticky}) ;
		} else {
			options = $.extend({}, defaults, options);
		}

		// create a unique id to track the objects
		this.id = idx++;
		// store the options
		this.options = options;

		// if the container doesn't exist, create it
		if( !$jnotify ){
			// we want to use one single container, so always use the default container class
			$jnotify = $('<div class="' + defaults.classContainer + '" />').appendTo("body");
			if( $.isFunction(options.init) ) options.init.apply(self, [$jnotify]);

			// removes a note from the DOM
			function removeElement($el){
				var jnotify = $el.data("jnotify");
				// speed up the fadeout
				jnotify.options.fadeSpeed = 250;
				// remove the note
				jnotify.remove();
			}

			/* attach delegated events */
			// attach "remove" functionality for close button
			delegateEvent($jnotify, "click.jnotify", "a." + options.classClose, function (e){
				removeElement($(e.currentTarget).closest("." + options.classNotification));
			});

			// remove when dismissible
			delegateEvent($jnotify, "click.jnotify", "div." + options.classDismissible, function (e){
				removeElement($(e.currentTarget));
			});
		}

		// create the notification
		function create(message){
			var html = '<div class="' + options.classNotification + (options.type.length ? (" " + options.classNotification + "-" + options.type) : "") + (options.clickToDismiss && !options.sticky ? (" " + options.classDismissible) : "") + '">'
			         + '<div class="' + options.classBackground + '"></div>'
			         + (options.sticky && options.showClose ? ('<a class="' + options.classClose + '">' + options.closeLabel + '</a>') : '')
			         + '<div class="' + options.classMessage + '">'
			         + '<div>' + message + '</div>'
			         + '</div></div>';

			// create the note
			var $note = $(html);
			// attach a reference to this object
			$note.data("jnotify", self);

			// add the layer
			$note.appendTo($jnotify);

			// run callback
			if( $.isFunction(options.create) ) options.create.apply(self, [$note, $jnotify]);

			// return the new note
			return $note;
		}

		function removeFromQueue(note){
			// loop through the open queue and remove the item
			for( var i=0; i < queue.length; i++ ){
				if( note.id === queue[i].id ){
					// remove the item
					queue.splice(i, 1);
					break;
				}
			}
		}

		// remove the notification
		this.remove = function (callback){
			var $msg = $note.find("." + options.classMessage), $parent = $msg.parent();
			// remove message from counter
			removeFromQueue(self);

			// run callback
			if( $.isFunction(options.beforeRemove) ) options.beforeRemove.apply(self, [$msg]);

			// cleans up notification
			function finished(){
				// remove the parent container
				$parent.remove();

				// run any callbacks asynchronously to avoid issues in Firefox 24 running callbacks continuously when a block operation occurs (such as an alert)
				if( $.isFunction(callback) ) setTimeout(function (){ callback.apply(self, [$msg]); }, 1);
				if( $.isFunction(options.remove) ) setTimeout(function (){ options.remove.apply(self, [$msg]); }, 1);
			}

			// check if a custom transition has been specified
			if( $.isFunction(options.transition) ) options.transition.apply(self, [$parent, $msg, queue.length-1, finished, options]);
			else {
				$msg.fadeTo(options.fadeSpeed, 0.01, function (){
					// if last item, just remove
					if( queue.length === 0 ) finished();
					// slide the parent closed
					else $parent.slideUp(options.slideSpeed, finished);
				});

				// if the last notification, fade out the container
				if( queue.length <= 0 ) $parent.fadeOut(options.fadeSpeed);
			}
		}

		// create the note
		var $note = create(message);

		// if not a sticky, add to show queue
		if( !options.sticky ){
			// add the message to the queue
			queue.push(this);
			// play queue
			$.jnotify.play();
		}

		return this;
	};

})(jQuery);
