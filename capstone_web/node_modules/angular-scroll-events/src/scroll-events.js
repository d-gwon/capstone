'use strict';

// Angular scroll events module
angular.module('g1b.scroll-events', [])

  // scroll-up directive
  .directive('scrollUp', function () {
    return {
      restrict: 'A',
      compile: function () {
        return {
          pre: function preLink() {},
          post: function postLink(scope, element, attrs) {
            element.bind('mousewheel wheel', function (ev) {
              ev = ev.originalEvent || ev;
              var delta = ev.wheelDelta || (ev.deltaY * -1) || 0;
              if ( delta > 0 ) {
                scope.$apply(function () {
                  scope.$eval(attrs.scrollUp);
                });
                ev.preventDefault();
              }
            });
          }
        };
      }
    };
  })

  // scroll-down directive
  .directive('scrollDown', function () {
    return {
      restrict: 'A',
      compile: function () {
        return {
          pre: function preLink() {},
          post: function postLink(scope, element, attrs) {
            element.bind('mousewheel wheel', function (ev) {
              ev = ev.originalEvent || ev;
              var delta = ev.wheelDelta || (ev.deltaY * -1) || 0;
              if ( delta < 0 ) {
                scope.$apply(function () {
                  scope.$eval(attrs.scrollDown);
                });
                ev.preventDefault();
              }
            });
          }
        };
      }
    };
  });
