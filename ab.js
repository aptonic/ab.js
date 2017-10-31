/*!
 * AB.js - A/B Testing JavaScript Framework
 * Copyright 2011
 * Released under the MIT License.
 * More information: https://github.com/aptonic/ab.js
 */

(function(){

var ABTest = function(config) {
   var ab = {};

   if (config.name.indexOf(' ') >= 0) {
      return false;
   }

   if(!config.name) {
      return false;
   } else {
      ab.name = config.name;
   }

   // disable or enable google analytics support
   if(!config.gaSupport) {
      ab.gaSupport = false;
   } else {
      ab.gaSupport = config.gaSupport;
   }

   if (!config.customVarSlot && config.gaSupport) {
      return false;
   } else {
      ab.customVarSlot = config.customVarSlot;
   }

   if (!config.variations) {
      return false;
   } else {
      ab.variations = config.variations;
   }

   if(!config.chooseVariationNumber) {
      ab.chooseVariationNumber = Math.floor(Math.random() * ABTestUtils.keys(ab.variations).length);
   } else {
      ab.chooseVariationNumber = config.chooseVariationNumber;
   }

   ab.newCookieSet = null;
   var cookieName = "abjs_" + ab.name;
   var queryString = ABTestUtils.queryString();
   ab.cookieVariation = ABTestUtils.getCookie(cookieName);
   ab.queryVariation = queryString["abjs-setvar-" + ab.name];

   if (ABTestUtils.isFunction(ab.variations[ab.queryVariation])) {
      ab.assignedVariation = ab.queryVariation;
   } else {
      ab.assignedVariation = ab.cookieVariation;
   }
   if(queryString["abjs-setcookie"] === "yes") {
      ab.newCookieSet = true;
   }

   if (ab.assignedVariation === "" || !(ABTestUtils.isFunction(ab.variations[ab.assignedVariation]))) {
      // Assign a variation and set cookie
      var variationNumber = ab.chooseVariationNumber;
      ab.assignedVariation = ABTestUtils.keys(ab.variations)[variationNumber];
      ab.newCookieSet = true;
   }

   if(ab.newCookieSet === true){
     var cookiePath = config.cookiePath || window.location.pathname;
      ABTestUtils.setCookie(cookieName, ab.assignedVariation, 365, cookiePath, config.domain);
   }

   ab.execute = function() {
      ABTestUtils.contentLoaded(window, function() { ab.variations[ab.assignedVariation]() });
   };

   ab.execute();

   if (ab.gaSupport) {
      window._gaq = window._gaq || [];
      window._gaq.push(["_setCustomVar", ab.customVarSlot, "abjs_" + ab.name, "abjs_" + ab.assignedVariation, 1]);
   }

   return ab;
};

var ABTestUtils = {};

ABTestUtils.setCookie = function(c_name, value, exdays, path, domain) {
   var exdate = new Date();
   exdate.setDate(exdate.getDate() + exdays);
   var c_value = escape(value) + ((exdays === null) ? "": "; expires=" + exdate.toUTCString());
   var cookie = c_name + "=" + c_value + "; path=" + path;
   if(domain) cookie += "; domain=" + domain;
   document.cookie = cookie;
};

ABTestUtils.getCookie = function(c_name) {
   var i, x, y, ARRcookies = document.cookie.split(";");
   for (i = 0; i < ARRcookies.length; i++) {
      x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
      y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
      x = x.replace(/^\s+|\s+$/g, "");
      if (x == c_name) {
         return unescape(y);
      }
   }
   return "";
};

ABTestUtils.keys = function(o) {
   if (o !== Object(o)) {
      throw new TypeError('ABTestUtils.keys called on non-object');
   }

   var ret = [];
   var p = null;
   for (p in o) {
      if(Object.prototype.hasOwnProperty.call(o,p)) {
         ret.push(p);
      }
   }
   return ret;
};

ABTestUtils.isFunction = function(object) {
   return !!(object && object.constructor && object.call && object.apply);
};

ABTestUtils.contentLoaded = function(win, fn) {

   var done = false, top = true,

       doc = win.document, root = doc.documentElement,

       add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
       rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
       pre = doc.addEventListener ? '' : 'on',

       init = function(e) {
          if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
          (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
          if (!done && (done = true)) fn.call(win, e.type || e);
       },

       poll = function() {
          try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
          init('poll');
       };

   if (doc.readyState == 'complete') fn.call(win, 'lazy');
   else {
      if (doc.createEventObject && root.doScroll) {
         try { top = !win.frameElement; } catch(e) { }
         if (top) poll();
      }
      doc[add](pre + 'DOMContentLoaded', init, false);
      doc[add](pre + 'readystatechange', init, false);
      win[add](pre + 'load', init, false);
   }
};

ABTestUtils.queryString = function() {
   var qsMap = {};
   var vars = window.location.search.substring(1).split("&");
   for (var i = 0; i < vars.length; i++) {
      var kvp = vars[i].split("=");
      qsMap[unescape(kvp[0])] = unescape(kvp[1]);
   }
   return qsMap;
};

if (typeof exports === 'object') {
   module.exports = {
      ABTest: ABTest,
      ABTestUtils: ABTestUtils
   };
} else {
   window.ABTest = ABTest;
   window.ABTestUtils = ABTestUtils;
}

})();
