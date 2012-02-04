$(document).ready(function() {

   function createABTest() {
      var myAbTest = ABTest({
         name : "example test",
         customVarSlot : 1,
         variations : {
            other : function() { },
            control : function() { }
         }
      });
      return myAbTest;
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

   var cookieName = "abjs_variation";
   var queryString = ABTestUtils.queryString();

   // Run module A by default
   if (!queryString["module"] || queryString["module"] == "A") {

      module("Module A", before);

      test("Check cookie is set and matches a variation function", function() {
      	expect(2);
         myAbTest = createABTest();
         
      	var cookieVariation = ABTestUtils.getCookie(cookieName);
      	notEqual(cookieVariation, '', cookieName + " cookie may not be empty");
      	equal(ABTestUtils.isFunction(myAbTest.variations[cookieVariation]), true, cookieName + " cookie does not match a variation function");
      });

   // Force control variation for next test
   document.getElementById("continue-link").href = "tests.html?module=B&abjs-setvar-example%20test=control&abjs-setcookie=yes";

   } else if (queryString["module"] == "B") {
      
      module("Module B", before);

      test("Try forcing the control variation", function() {
      	expect(1);
         createABTest();
	
      	var cookieVariation = ABTestUtils.getCookie(cookieName);
      	equal(cookieVariation, 'control', 'Cookie should have been set to control');
      });
   
      // Force other variation for next test
      document.getElementById("continue-link").href = "tests.html?module=C&abjs-setvar-example%20test=other&abjs-setcookie=yes";
      
   } else if (queryString["module"] == "C") {
      
      module("Module C", before);

      test("Try forcing the other variation", function() {
      	expect(1);
         createABTest();
	
      	var cookieVariation = ABTestUtils.getCookie(cookieName);
      	equal(cookieVariation, 'other', 'Cooke should have been set to other');
      });
   
   document.getElementById("continue-link").href = "tests.html";
   document.getElementById("continue-link").innerHTML = "";
   }

});