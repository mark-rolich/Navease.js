/**
 * @class
 * @classdesc Smooth scroll between anchor links on the page using different easing functions
 *
 * @author Mark Rolich <mark.rolich@gmail.com>
 * @copyright Mark Rolich 2016
 * @license MIT
 *
 * @throws Throw an exception if easing function is not defined in Easing.js
 * @throws Throw an exception if frames count is less than 1
 *
 * @param {number} [frames=25] frames count (lower is faster, minimum is 1)
 * @param {string} [easing="isInOutQuad"] easing function name from Easing.js
 * @param {string} [selector="a[name]"] apply navease functionality to the specified selector only
 *
 * @example
 * new Navease(60, "easeInOutCubic", ".scroll");
 */
var Navease = function (frames, easing, selector) {
    "use strict";

    var start = 0;
    var total = (frames !== undefined)
        ? frames
        : 30;
    var easingFunc = (easing !== undefined)
        ? easing
        : 'easeInOutQuad';
    var startPos = 0;
    var currentPos = 0;
    var finalPos = 0;
    var request = null;
    var postfix = "-navease";
    var elems = (selector !== undefined)
        ? selector
        : "a[name]";

    if (Easing[easingFunc] === undefined) {
        throw "Easing " + easingFunc + " is not defined";
    }

    if (frames < 1) {
        throw "Minimum frame count is 1";
    }

    var init = function () {
        if (window.addEventListener !== undefined) {
            var links = document.querySelectorAll(elems),
                idx;

            for (idx in links) {
                if (links.hasOwnProperty(idx)) {
                    links[idx].setAttribute("name", links[idx].getAttribute("name") + postfix);
                }
            }

            window.addEventListener("hashchange", hashHandler);
        }
    };

    var getAnchorPosition = function (id) {
        var anchorId = 'a[name="' + id + '"]';
        var anchorId1 = 'a[name="' + id + postfix + '"]';
        var anchor = document.querySelector(anchorId) || document.querySelector(anchorId1);

        startPos = window.scrollY || document.documentElement.scrollTop;

        if (anchor !== null) {
            anchor.scrollIntoView();

            finalPos = window.scrollY || document.documentElement.scrollTop;

            if (startPos !== finalPos) {
                window.scroll(0, startPos);
            }
        }
    };

    var reset = function () {
        start = 0;
        request = null;
    };

    var animate = function () {
        currentPos = Easing[easingFunc](start, startPos, -(startPos - finalPos), total);

        window.scroll(0, currentPos);

        if (start < total) {
            request = window.requestAnimationFrame(animate);
            start += 1;
        } else {
            reset();
        }
    };

    var hashHandler = function () {
        getAnchorPosition(window.location.hash.substring(1));

        if (request !== null) {
            window.cancelAnimationFrame(request);
        }

        reset();

        if (startPos !== finalPos) {
            animate();
        }
    };

    init();
};