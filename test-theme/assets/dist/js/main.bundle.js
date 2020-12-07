/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

jQuery(document).ready(function () {
  c9Page.init();
});

var c9Page = function ($) {
  var c9PageInit = {};

  c9PageInit.init = function () {
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////// Sidebars on some templates //////////////////////////////////////////////////
    jQuery(window).scroll(function () {
      //scroll position variable
      var scroll = jQuery(window).scrollTop();

      if (scroll >= 133) {
        jQuery("#left-sidebar").addClass("fixed-sidebar");
        jQuery("#right-sidebar").addClass("fixed-sidebar");
      }

      if (scroll <= 132) {
        jQuery("#left-sidebar").removeClass("fixed-sidebar");
        jQuery("#right-sidebar").removeClass("fixed-sidebar");
      }
    }); //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////// Mobile and desktop navigation classes //////////////////////////////////////////////////

    if ($(window).width() <= 667) {
      //use small nav for mobile
      $(".navbar").addClass("navbar-small");
      $("body").addClass("navbar-small");
      $(window).scroll(function () {
        //scroll position variable
        var scroll = $(window).scrollTop();

        if (scroll >= 288) {
          $(".navbar").addClass("opacity0");
        }

        if (scroll <= 287) {
          $(".navbar").removeClass("opacity0");
        }

        if (scroll >= 338) {
          $(".navbar").addClass("fixed-top opacity100");
          $(".header-navbar").addClass("jumpfix"); //accounts for position-fixed CSS change
        }

        if (scroll <= 337) {
          $(".navbar").removeClass("fixed-top opacity100");
          $(".header-navbar").removeClass("jumpfix"); //remove extra classes and put navs back at top
        }
      });
    } else {
      //end small screens so desktop next
      //var logoHeight = $(".c9-custom-logo").height();
      $(window).scroll(function () {
        //scroll position variable
        var scroll = $(window).scrollTop();

        if (scroll >= 168) {
          $(".navbar").addClass("opacity0");
        }

        if (scroll <= 167) {
          $(".navbar").removeClass("opacity0");
        }

        if (scroll >= 218) {
          $(".navbar").addClass("navbar-small fixed-top opacity100"); //shrink nav and fix it to top

          $(".header-navbar").addClass("jumpfix"); //$(".header-navbar.jumpfix").css("height", "108px");
        }

        if (scroll <= 217) {
          $(".navbar").removeClass("navbar-small fixed-top opacity100"); //expand nav and remove fixed

          $(".header-navbar").removeClass("jumpfix");
        }
      });
    } //end regular
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////// for putting WordPress galleries linked to images/videos in lightbox ////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    $(".cortex-popup-video,a.wp-block-button__link[href*='youtube.com'],a.wp-block-button__link[href*='vimeo.com'],a.wp-block-button__link[href*='maps.google.com']").magnificPopup({
      disableOn: 700,
      type: "iframe",
      mainClass: "mfp-zoom-in",
      removalDelay: 160,
      preloader: false,
      fixedContentPos: false
    });
    $("a.wp-block-button__link[href*='youtu.be']").magnificPopup({
      type: "iframe",
      iframe: {
        patterns: {
          youtube_short: {
            index: 'youtu.be/',
            id: 'youtu.be/',
            src: '//www.youtube.com/embed/%id%?autoplay=1'
          }
        }
      }
    });
    $('.wp-block-image a[href$=".jpg"]').magnificPopup({
      disableOn: 700,
      type: "image",
      mainClass: "mfp-zoom-in",
      tError: '<a href="%url%">The image</a> could not be loaded.',
      removalDelay: 160,
      preloader: false,
      fixedContentPos: false
    });
    $('.wp-block-gallery a[href$=".jpg"], .wp-block-gallery a[href$=".jpeg"], .wp-block-gallery a[href$=".png"], .wp-block-gallery a[href$=".gif, "], .cortex-popup, .gallery-item a').click(function (e) {
      e.preventDefault();
      var items = [];
      var firstItem = $(this).attr("href");
      var firstCaption = $(this).attr("title");
      items.push({
        src: firstItem,
        title: firstCaption
      }); //items after

      $(this).parent().parent().nextAll().children().find("a").each(function () {
        var imageLink = $(this).attr("href");
        var imageCaption = $(this).attr("title");
        items.push({
          src: imageLink,
          title: imageCaption
        });
      }); //items before

      $(this).parent().parent().prevAll().children().find("a").each(function () {
        var imageLink = $(this).attr("href");
        var imageCaption = $(this).attr("title");
        items.push({
          src: imageLink,
          title: imageCaption
        });
      });
      $.magnificPopup.open({
        items: items,
        type: "image",
        gallery: {
          enabled: true
        },
        mainClass: "mfp-zoom-in",
        callbacks: {
          open: function () {
            //overwrite default prev + next function. Add timeout for css3 crossfade animation
            $.magnificPopup.instance.next = function () {
              var self = this;
              self.wrap.removeClass("mfp-image-loaded");
              setTimeout(function () {
                $.magnificPopup.proto.next.call(self);
              }, 120);
            };

            $.magnificPopup.instance.prev = function () {
              var self = this;
              self.wrap.removeClass("mfp-image-loaded");
              setTimeout(function () {
                $.magnificPopup.proto.prev.call(self);
              }, 120);
            };
          },
          imageLoadComplete: function () {
            var self = this;
            setTimeout(function () {
              self.wrap.addClass("mfp-image-loaded");
            }, 16);
          }
        }
      });
    }); //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////       full screen search        ///////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Will hold previously focused element

    var focusedElementBeforeModal;
    var modal = $("#fullscreensearch"); //open modal for search

    $(".btn-nav-search").on("click", fullScreenSearch);

    function fullScreenSearch(e) {
      e.preventDefault(); //refocus on this when closed

      focusedElementBeforeModal = document.activeElement; //listen for tab keying to trab tabs in modal

      $("body").on("keydown", modal, trapTabKey); // Find all focusable children

      var focusableElements = 'a[href], input:not([disabled]), button:not([disabled])';
      focusableElements = document.querySelector('#fullscreensearch').querySelectorAll(focusableElements); // Convert NodeList to Array

      focusableElements = Array.prototype.slice.call(focusableElements);
      var firstTabStop = focusableElements[0];
      var lastTabStop = focusableElements[focusableElements.length - 1];
      $("#fullscreensearch").addClass("open");
      focusableElements[0].focus();

      function trapTabKey(e) {
        // Check for TAB key press
        if (e.keyCode === 9) {
          // SHIFT + TAB
          if (e.shiftKey) {
            if (document.activeElement === firstTabStop) {
              e.preventDefault();
              lastTabStop.focus();
            } // TAB

          } else {
            if (document.activeElement === lastTabStop) {
              e.preventDefault();
              firstTabStop.focus();
            }
          }
        }
      }
    } //end fullScreenSearch
    //close modal


    $("#fullscreensearch .search-close, #fullscreensearch .search-close .fa-close").on("click", function (e) {
      // if escape is hit or if search close is clicked
      if (e.target == this || e.target.className == "search-close" || e.keyCode == 27) {
        $(this).removeClass("open");
        $(this).parent().removeClass("open");
        $(this).parent().parent().removeClass("open");
        focusedElementBeforeModal.focus();
      }
    }); //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////       Navbar Accessibility        /////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Will hold previously focused element

    var focusedElementBeforeNavbar;
    var c9starterNavbar = $("#wrapper-navbar");
    $(".navbar-toggler").on("click", c9starterNavbarUse);

    function c9starterNavbarUse(e) {
      e.preventDefault(); //listen for tab keying to trap tabs in navbar

      $("body").on("keydown", c9starterNavbar, trapTabKey);
      focusedElementBeforeNavbar = $(".btn-nav-search"); // Find all focusable children

      var focusableElements = 'a[href]:not(.custom-logo-link):not(.btn-nav-search), input:not([disabled]):not(#searchsubmit):not(#s), button:not([disabled])';
      focusableElements = document.querySelector('#wrapper-navbar').querySelectorAll(focusableElements); // Convert NodeList to Array

      focusableElements = Array.prototype.slice.call(focusableElements);
      var firstTabStop = focusableElements[0];
      var lastTabStop = focusableElements[focusableElements.length - 1];
      focusableElements[0].focus();

      function trapTabKey(e) {
        // Check for TAB key press
        if (e.keyCode === 9) {
          // SHIFT + TAB
          if (e.shiftKey) {
            if (document.activeElement === firstTabStop) {
              e.preventDefault();
              lastTabStop.focus();
            } // TAB

          } else {
            if (document.activeElement === lastTabStop) {
              e.preventDefault();
              firstTabStop.focus();
            }
          }
        }
      }
    } //end c9starterNavbarUse
    //close navbar


    $('#wrapper-navbar').on("click", '.navbar-toggler[aria-expanded="true"]', function (e) {
      // if escape is hit or if search close is clicked
      if (e.target == this || e.target.className == ".navbar-toggler" || e.keyCode == 27) {
        focusedElementBeforeNavbar.focus();
      }
    });
  };

  return c9PageInit;
}(jQuery);

/***/ })
/******/ ]);