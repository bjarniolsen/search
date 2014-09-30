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
            // we keep all information in this object
            var options = {};
            // cache dom
            options.root = $(".site-wrapper");
            options.suggestionsWrapper = options.root.find(".suggestions");
            options.suggestionsList = options.suggestionsWrapper.find(".suggestions__list");
            options.input = options.root.find('input[type="text"]');
            //options.submit = options.root.find('input[type="submit"]');
			// disable submit button until we have some input text
			//Engine.ui.button.disable(options.submit);

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
					//Engine.handleInputEvent.blur(options)
				}).bind("keyup", function() {
					Engine.handleInputEvent.keyup(options)
				});
        },
        ui: {
        	build: {
        		dropdown: function(options, suggestions) {
					var listitems = [];
					options.suggestionsList.empty();
					if (!suggestions.length) {
						options.suggestionsWrapper.addClass("is-hidden");
					} else {
						for (var i=0, len=suggestions.length; i < len; i++) {
							listitems.push('<li class="suggestions__listitem"><a href="#" class="suggestions__listlink">' + suggestions[i] + '</a></li>');
						}
						options.suggestionsList.append(listitems);
					}
        		}
        	},
        	button: {
        		disable: function(button) {
        			$(button).attr("disabled", "disabled").addClass("disabled");
        		},
        		enable: function(button) {
        			$(button).removeAttr("disabled").removeClass("disabled");
        		}
        	}
        },
        autoSuggestControl: {
        	typeAhead: function() {
        	},
        	autosuggest: function(options, suggestions) {
        		// do something with suggestions here
        		// and send them to the UI
        		Engine.ui.build.dropdown(options, suggestions);
        	},
        	requestSuggestions: function(options, suggestion) {
				var suggestions = [];
				$.getJSON("result.json")
					.done(function(data) {
						for (var i=0, len=data.terms.length; i < len; i++) {
							if (data.terms[i].indexOf(suggestion) === 0) {
								suggestions.push(data.terms[i]);
							}
						}
						Engine.autoSuggestControl.autosuggest(options, suggestions);
					})
					.fail(function(jqxhr, textStatus, error) {
						console.log(jqxhr, textStatus, error);
					});
        	}
        },
        handleInputEvent: {
        	focus: function(options) {
				options.root.removeClass("waiting");
        	},
        	blur: function(options) {
				//
        	},
        	keyup: function(options) {
				var iKeyCode = event.keyCode,
					value = "";

				// iKeyCode 8 = backspace
				// We need this to keep searching when deleting charactors 
				if ((iKeyCode < 32 && iKeyCode != 8) || (iKeyCode >= 33 && iKeyCode <= 46) || (iKeyCode >= 112 && iKeyCode <= 123)) {
					//ignore
					console.log("Tast: ", iKeyCode);
				} else if (iKeyCode == 40) { // Down
					Engine.ui.dropdown.selectSuggestion.down();
				} else if (iKeyCode == 38) { // Up
					Engine.ui.dropdown.selectSuggestion.down();
				} else {
					value = options.input.val();
					if (value.length > 0) {
						//$(document).trigger("can.search", true);
						options.suggestionsWrapper.removeClass("is-hidden");
					} else {
						options.suggestionsWrapper.addClass("is-hidden");
						options.suggestionsList.empty();
					}
					Engine.autoSuggestControl.requestSuggestions(options, value);
				}
        	}
        },
        dummyArray: [
			"Alabama", "Alaska", "Arizona", "Arkansas",
        	"California", "Colorado", "Connecticut",
        	"Delaware", "Florida", "Georgia", "Hawaii",
        	"Idaho", "Illinois", "Indiana", "Iowa",
        	"Kansas", "Kentucky", "Louisiana",
        	"Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", 
        	"Mississippi", "Missouri", "Montana",
        	"Nebraska", "Nevada", "New Hampshire", "New Mexico", "New York",
        	"North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", 
        	"Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
        	"Tennessee", "Texas", "Utah", "Vermont", "Virginia", 
        	"Washington", "West Virginia", "Wisconsin", "Wyoming"
        ]
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