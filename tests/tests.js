$(document).ready(function() {
   window.testdivString = "The content of this div was modified by an A/B test variation function. This is good."
   window.variation8String = "Variation 8 of example test 2 did this.";
   window.variationControlString = "Control variation of example test 2 did this.";
   window.wrongVariationString = "WRONG! This variation should not have been called."

   function createABTest() {
      var myAbTest = ABTest({
         name : "example_test",
         customVarSlot : 1,
         variations : {
            other : function() { document.getElementById("testdiv").innerHTML = window.testdivString  },
            control : function() { document.getElementById("testdiv").innerHTML = window.testdivString  }
         }
      });
      return myAbTest;
   }
   
   function createAnotherABTest() {
      // This test has lots of variations to decrease the chance that the correct variation is chosen randomly
      // when we test forcing the variation using query parameters
      var testdiv = document.getElementById("testdiv");
      
      var myAbTest = ABTest({
         name : "example_test_2",
         customVarSlot : 1,
         variations : {
            other : function() { document.getElementById("testdiv").innerHTML = window.wrongVariationString },
            variation1 : function() { testdiv.innerHTML = window.wrongVariationString },
            variation2 : function() { testdiv.innerHTML = window.wrongVariationString },
            variation3 : function() { testdiv.innerHTML = window.wrongVariationString },
            variation4 : function() { testdiv.innerHTML = window.wrongVariationString },
            variation5 : function() { testdiv.innerHTML = window.wrongVariationString },
            variation6 : function() { testdiv.innerHTML = window.wrongVariationString },
            variation7: function() { testdiv.innerHTML = window.wrongVariationString },
            variation8: function() { testdiv.innerHTML = window.variation8String },
            variation9: function() { testdiv.innerHTML = window.wrongVariationString },
            control : function() { testdiv.innerHTML = window.variationControlString }
         }
      });
      return myAbTest;
   }

   function createMultipleABTests() {
      var testdiv = document.getElementById("testdiv");
      var testdiv2 = document.getElementById("testdiv2");
      
      var firstTest = ABTest({
         name : "first_test",
         customVarSlot : 1,
         variations : {
            variation1 : function() { testdiv.innerHTML = "Variation 1 did this" },
            variation2 : function() { testdiv.innerHTML = window.wrongVariationString },
            variation3 : function() { testdiv.innerHTML = window.wrongVariationString },
            variation4 : function() { testdiv.innerHTML = window.wrongVariationString },
            control : function() { testdiv.innerHTML = window.wrongVariationString }
         }
      });
      
      var secondTest = ABTest({
         name : "second_test",
         customVarSlot : 1,
         variations : {
            variation1 : function() { testdiv.innerHTML = window.wrongVariationString },
            variation2 : function() { testdiv2.style.display = "block" },
            variation3 : function() { testdiv.innerHTML = window.wrongVariationString },
            variation4 : function() { testdiv.innerHTML = window.wrongVariationString },
            control : function() { testdiv.innerHTML = window.wrongVariationString }
         }
      });
      return [firstTest, secondTest];
   }

   // Clear all cookies before running each test
   var before = {
      setup: function () {
         cookies = document.cookie.split('; ')
         for (var i = 0, c; (c = (cookies)[i]) && (c = c.split('=')[0]); i++) {
            document.cookie = c + '=; expires=' + new Date(0).toUTCString();
         }
      }
   };

   var queryString = ABTestUtils.queryString();

   // Run module A by default
   if (!queryString["module"] || queryString["module"] == "A") {

      module("Module A", before);

      test("Check cookie is set and matches a variation function", function() {
      	expect(2);
         abTest = createABTest(); 
         cookieName = "abjs_" + abTest.name;
      	var cookieVariation = ABTestUtils.getCookie(cookieName);
      	notEqual(cookieVariation, '', cookieName + " cookie may not be empty");
      	equal(ABTestUtils.isFunction(abTest.variations[cookieVariation]), true, cookieName + " cookie does not match a variation function");
      });
      
      test("Check a variation was called and actually did something", function() {
         createABTest();
         equal(document.getElementById("testdiv").innerHTML, window.testdivString, "A variation function did not change the content of testdiv");
      });
      // Force control variation for next test
      document.getElementById("continue-link").href = "tests.html?module=B&abjs-setvar-example_test_2=control&abjs-setcookie=yes";

   } else if (queryString["module"] == "B") {
      
      module("Module B", before);

      test("Try forcing the control variation", function() {
      	expect(1);
         abTest = createAnotherABTest();
	      cookieName = "abjs_" + abTest.name;
      	var cookieVariation = ABTestUtils.getCookie(cookieName);
      	equal(cookieVariation, 'control', 'Cookie should have been set to control');
      });
      
      test("Check control variation function was called and actually did something", function() {
      	expect(1);
         createAnotherABTest();
         equal(document.getElementById("testdiv").innerHTML, window.variationControlString, "Control variation function did not change the content of testdiv");
      });
   
      // Force variation8 on example test 2 for next test
      document.getElementById("continue-link").href = "tests.html?module=C&abjs-setvar-example_test_2=variation8&abjs-setcookie=yes";
      
   } else if (queryString["module"] == "C") {
      
      module("Module C", before);

      test("Try forcing variation8", function() {
      	expect(1);
         abTest = createAnotherABTest();
		   cookieName = "abjs_" + abTest.name;
      	var cookieVariation = ABTestUtils.getCookie(cookieName);
      	equal(cookieVariation, 'variation8', 'Cookie should have been set to variation8');
      });
   
   // Force variation 1 on first test and variation 2 on second test for next test
   document.getElementById("continue-link").href = "tests.html?module=D&abjs-setvar-first_test=variation1&abjs-setvar-second_test=variation2&abjs-setcookie=yes";
   
   } else if (queryString["module"] == "D") {

      module("Module D", before);
      
      // Try with multiple A/B tests on a single page
      test("Try forcing variation1 on first test and variation 2 on second test", function() {
      	expect(2);
         abTests = createMultipleABTests();
	
      	var cookieTest1 = ABTestUtils.getCookie(cookieName = "abjs_" + abTests[0].name);
      	var cookieTest2 = ABTestUtils.getCookie(cookieName = "abjs_" + abTests[1].name);
      	
      	equal(cookieTest1, 'variation1', 'Cookie ' + abTests[0].name + ' should have been set to variation1');
      	equal(cookieTest2, 'variation2', 'Cookie ' + abTests[1].name + ' should have been set to variation2');
      });
      
      test("Check variation functions were called and actually did something", function() {
      	expect(2);
      	createMultipleABTests();
      	
         equal(document.getElementById("testdiv").innerHTML, "Variation 1 did this", "Variation 1 did not change the content of testdiv");
         equal(document.getElementById("testdiv2").style.display, "block", "Variation 2 of the second test did not unhide testdiv2");
      });
      
      document.getElementById("continue-link").href = "tests.html";
      document.getElementById("continue-link").innerHTML = "";
   }

});