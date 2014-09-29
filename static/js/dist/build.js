/* DIS/PLAY Script 
    Author's name: Nicolaj Lund Nielsen
    Modified by:
    Client name: DIS/PLAY
    Date of creation: 2/7 - 2013
*/
jQuery.noConflict();
jQuery(function ($) {
    Engine = {
        init: function () {
            $(document).ready(function ($) {

            });
            $(window).load(function ($) {
                // Her kører vi onload funktioner
                Engine.fixes.init();
            });

            // we keep all information in this object
            var options = {};
            // cache dom
            options.root = $(".site-wrapper");
            options.input = options.root.find('input[type="text"]');
            options.submit = options.root.find('input[type="submit"]');
			// disable submit button until we have some input text
			Engine.ui.button.disable(options.submit);

            // custom events
            $(document).bind("can.search", function(event, param) {
				if (param) {
					Engine.ui.button.enable(options.submit);
				} else {
					Engine.ui.button.disable(options.submit);
				}
            });

			// bind some events to our INPUT field
			options.input
				.bind("focus", function() {
					Engine.handleInputEvent.focus(options)
				}).bind("blur", function() {
					Engine.handleInputEvent.blur(options)
				}).bind("keyup", function() {
					Engine.handleInputEvent.keyup(options)
				});

        },
        fixes: {
            init: function () {                
				// Fix functions goes here
            }
        },        
        ui: {
        	button: {
        		disable: function(button) {
        			$(button).attr("disabled", "disabled").addClass("disabled");
        		},
        		enable: function(button) {
        			$(button).removeAttr("disabled").removeClass("disabled");
        		}
        	}
        },
        handleInputEvent: {
        	focus: function(options) {
        		console.log("hest: ", event);
				options.root.removeClass("waiting");
        	},
        	blur: function(options) {
				//options.root.addClass("waiting");
        	},
        	keyup: function(options) {
				var iKeyCode = event.keyCode;

				if (iKeyCode < 32 || (iKeyCode >= 33 && iKeyCode <= 46) || (iKeyCode >= 112 && iKeyCode <= 123)) {
					//ignore
				} else {
					//autosuggest
					if(options.input.val().length > 1) {
						console.log(options.input.val());
						$(document).trigger("can.search", true);
					}
				}
        	}
        }
    }
    // Initialize main script-Engine;
    Engine.init();
});

// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place original and minified jQuery/helper plugins under this line.

// Place modifeid jQuery/helper plugins under this line.