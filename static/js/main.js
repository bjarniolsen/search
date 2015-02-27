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
            options.form = options.root.find('form');
            options.input = options.root.find('input[type="text"]');
            options.chosen = "";
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

			// validate form on submit
			options.form.bind("submit", function() {
				console.log("submit, NOT!", options.input.val());
				return false;
			});

			// bind some events to our INPUT field
			options.input
				.bind("focus", function() {
					Engine.handleInputEvent.focus(options)
				}).bind("blur", function() {
					Engine.handleInputEvent.blur(options)
				}).bind("keyup", function() {
					Engine.handleInputEvent.keyup(options)
				}).bind("keydown", function() {
					Engine.handleInputEvent.keydown(options)
				});
        },
        ui: {
        	dropdown: {
        		build: function(options, suggestions) {
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
        		Engine.ui.dropdown.build(options, suggestions);
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
				options.root.removeClass("ready");
        	},
        	keyup: function(options) {
				var iKeyCode = event.keyCode,
					value = "";

				// iKeyCode 8 = backspace
				// iKeyCode 46 = delete
				// We need these to keep searching when deleting charactors 
				if ((iKeyCode < 32 && iKeyCode != 8) || (iKeyCode >= 33 && iKeyCode <= 45) || (iKeyCode >= 112 && iKeyCode <= 123)) {
					//ignore
					//console.log("Tast: ", iKeyCode);
				} else {
					// reset chosen value so we step down the suggestions from top
					options.chosen = "";
					value = options.input.val();
					if (value.length > 0) {
						//$(document).trigger("can.search", true);
						options.root.addClass("ready");
						options.suggestionsWrapper.removeClass("is-hidden");
					} else {
						options.suggestionsWrapper.addClass("is-hidden");
						options.suggestionsList.empty();
					}
					Engine.autoSuggestControl.requestSuggestions(options, value);
				}
        	},
			keydown: function(options) {
				var iKeyCode = event.keyCode,
					value = options.input.val();

				if (value.length > 0) {
					if (iKeyCode == 40 || iKeyCode == 38) {

						var listitems = options.suggestionsList.find(".suggestions__listitem").removeClass("is-active");

						if (iKeyCode == 40) { // Down
							if (options.chosen === "") {
								options.chosen = 0;
							} else if ( (options.chosen+1) < listitems.length ) {
								options.chosen++;
							}
						} else if (iKeyCode == 38) { // Up
							if (options.chosen === "") {
								options.chosen = 0;
							} else if ( options.chosen > 0 ) {
								options.chosen--;
							}
						}

						$(listitems[options.chosen]).addClass("is-active");
						var result = $(listitems[options.chosen]).text();
						options.input.val(result);
					}
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
