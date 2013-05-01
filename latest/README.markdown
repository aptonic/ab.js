# AB.js - A/B Testing JavaScript Framework

![Logo](http://aptonic.github.com/ab.js/images/abjs.png)

See the [project website](http://aptonic.github.com/ab.js) for a demo and more info.

Concept and Design by [Paul William](https://github.com/newzealandpaul)

Developed by [John Winter](http://www.aptonic.com) (john@aptonic.com)

## Usage

We host the latest version of AB.js on GitHub and you can include it in your pages header with:

	<script type="text/javascript" src="http://aptonic.github.com/ab.js/ab.js"></script>

Or alternatively you can copy ab.js into the js directory inside your web site root and include in the pages head section with:

	<script type="text/javascript" src="js/ab.js"></script>

Directly after this include you can setup your A/B tests as follows:

	<script type="text/javascript">

	var myAbTest = ABTest({
	    name: "Example_Test",
	    customVarSlot: 1,
	    variations: {
	        first_variation: function () {
	            document.getElementById("content").innerHTML = "This is a variation";
	        },
	        another_variation: function () {
	            document.getElementById("content").innerHTML = "This is another variation";
	        },
	        control: function () { /* Empty function. */
	        }
	    }
	});
	
	</script>

You can have as many variation functions as you want. The test name and variation names must not contain any spaces.
The first time the page loads, one of the variation functions will be selected at random and run.

A cookie will then be set so that each time the user loads the page they see the same variation.

There is nothing special about the control function, it is just another variation.   
Normally the control will just be an empty function.

A Google Analytics custom variable will be set called "abjs_{test name}" This variable contains the name of the variation shown to that user.
You can compare the performance of each variation in the Demographics -> Custom Variables section of
Google Analytics.

There is an example A/B test setup in examples/example.html

## Forcing a variation

During testing you may want to force a particular variation, you can do this by adding something like:

?abjs-setvar-Example_Test=first_variation&abjs-setcookie=yes

To the end of the page URL. The above example would force an A/B test named Example_Test to use the variation first_variation.

## Unit tests

There are QUnit tests in the tests folder. You can run these by opening the tests.html page. 

Note that these will fail in Google Chrome if run locally as Chrome does not support cookie storage for file:// URLs.
The same applies for the examples/example.html test page.

## Browser support

The framework should work in all modern browsers and it has been tested in the following:

* Internet Explorer 6+
* Firefox 4+
* Chrome
* Safari
* Opera

## License

This code is released under the MIT License.

## Many Thanks 

* contentloaded() by [Diego Perini](https://github.com/dperini)
* isFunction() from [Underscore.js](http://documentcloud.github.com/underscore/)
* queryString() from [jquip](https://github.com/mythz/jquip)
* QUnit() from [jQuery](http://docs.jquery.com/QUnit)
