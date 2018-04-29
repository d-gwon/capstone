(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/Subject'), require('rxjs/Observable'), require('rxjs/observable/merge'), require('rxjs/observable/interval'), require('rxjs/operators/map'), require('rxjs/operators/mergeMap'), require('rxjs/operators/takeUntil'), require('rxjs/operators/filter'), require('rxjs/operators/pairwise'), require('rxjs/operators/take'), require('rxjs/operators/throttle'), require('rxjs/operators/share')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs/Subject', 'rxjs/Observable', 'rxjs/observable/merge', 'rxjs/observable/interval', 'rxjs/operators/map', 'rxjs/operators/mergeMap', 'rxjs/operators/takeUntil', 'rxjs/operators/filter', 'rxjs/operators/pairwise', 'rxjs/operators/take', 'rxjs/operators/throttle', 'rxjs/operators/share'], factory) :
	(factory((global['angular-resizable-element'] = {}),global.ng.core,global.Rx,global.Rx,global.Rx.Observable,global.Rx.Observable,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype));
}(this, (function (exports,core,Subject,Observable,merge,interval,map,mergeMap,takeUntil,filter,pairwise,take,throttle,share) { 'use strict';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} value1
 * @param {?} value2
 * @param {?=} precision
 * @return {?}
 */
function isNumberCloseTo(value1, value2, precision) {
    if (precision === void 0) { precision = 3; }
    var /** @type {?} */ diff = Math.abs(value1 - value2);
    return diff < precision;
}
/**
 * @param {?} startingRect
 * @param {?} edges
 * @param {?} clientX
 * @param {?} clientY
 * @return {?}
 */
function getNewBoundingRectangle(startingRect, edges, clientX, clientY) {
    var /** @type {?} */ newBoundingRect = {
        top: startingRect.top,
        bottom: startingRect.bottom,
        left: startingRect.left,
        right: startingRect.right
    };
    if (edges.top) {
        newBoundingRect.top += clientY;
    }
    if (edges.bottom) {
        newBoundingRect.bottom += clientY;
    }
    if (edges.left) {
        newBoundingRect.left += clientX;
    }
    if (edges.right) {
        newBoundingRect.right += clientX;
    }
    newBoundingRect.height = newBoundingRect.bottom - newBoundingRect.top;
    newBoundingRect.width = newBoundingRect.right - newBoundingRect.left;
    return newBoundingRect;
}
/**
 * @param {?} element
 * @param {?} ghostElementPositioning
 * @return {?}
 */
function getElementRect(element, ghostElementPositioning) {
    var /** @type {?} */ translateX = 0;
    var /** @type {?} */ translateY = 0;
    var /** @type {?} */ style = element.nativeElement.style;
    var /** @type {?} */ transformProperties = [
        'transform',
        '-ms-transform',
        '-moz-transform',
        '-o-transform'
    ];
    var /** @type {?} */ transform = transformProperties
        .map(function (property) { return style[property]; })
        .find(function (value) { return !!value; });
    if (transform && transform.includes('translate')) {
        translateX = transform.replace(/.*translate\((.*)px, (.*)px\).*/, '$1');
        translateY = transform.replace(/.*translate\((.*)px, (.*)px\).*/, '$2');
    }
    if (ghostElementPositioning === 'absolute') {
        return {
            height: element.nativeElement.offsetHeight,
            width: element.nativeElement.offsetWidth,
            top: element.nativeElement.offsetTop - translateY,
            bottom: element.nativeElement.offsetHeight +
                element.nativeElement.offsetTop -
                translateY,
            left: element.nativeElement.offsetLeft - translateX,
            right: element.nativeElement.offsetWidth +
                element.nativeElement.offsetLeft -
                translateX
        };
    }
    else {
        var /** @type {?} */ boundingRect = element.nativeElement.getBoundingClientRect();
        return {
            height: boundingRect.height,
            width: boundingRect.width,
            top: boundingRect.top - translateY,
            bottom: boundingRect.bottom - translateY,
            left: boundingRect.left - translateX,
            right: boundingRect.right - translateX,
            scrollTop: element.nativeElement.scrollTop,
            scrollLeft: element.nativeElement.scrollLeft
        };
    }
}
/**
 * @param {?} __0
 * @return {?}
 */
function isWithinBoundingY(_a) {
    var clientY = _a.clientY, rect = _a.rect;
    return clientY >= rect.top && clientY <= rect.bottom;
}
/**
 * @param {?} __0
 * @return {?}
 */
function isWithinBoundingX(_a) {
    var clientX = _a.clientX, rect = _a.rect;
    return clientX >= rect.left && clientX <= rect.right;
}
/**
 * @param {?} __0
 * @return {?}
 */
function getResizeEdges(_a) {
    var clientX = _a.clientX, clientY = _a.clientY, elm = _a.elm, allowedEdges = _a.allowedEdges, cursorPrecision = _a.cursorPrecision;
    var /** @type {?} */ elmPosition = elm.nativeElement.getBoundingClientRect();
    var /** @type {?} */ edges = {};
    if (allowedEdges.left &&
        isNumberCloseTo(clientX, elmPosition.left, cursorPrecision) &&
        isWithinBoundingY({ clientY: clientY, rect: elmPosition })) {
        edges.left = true;
    }
    if (allowedEdges.right &&
        isNumberCloseTo(clientX, elmPosition.right, cursorPrecision) &&
        isWithinBoundingY({ clientY: clientY, rect: elmPosition })) {
        edges.right = true;
    }
    if (allowedEdges.top &&
        isNumberCloseTo(clientY, elmPosition.top, cursorPrecision) &&
        isWithinBoundingX({ clientX: clientX, rect: elmPosition })) {
        edges.top = true;
    }
    if (allowedEdges.bottom &&
        isNumberCloseTo(clientY, elmPosition.bottom, cursorPrecision) &&
        isWithinBoundingX({ clientX: clientX, rect: elmPosition })) {
        edges.bottom = true;
    }
    return edges;
}
/**
 * @record
 */
var DEFAULT_RESIZE_CURSORS = Object.freeze({
    topLeft: 'nw-resize',
    topRight: 'ne-resize',
    bottomLeft: 'sw-resize',
    bottomRight: 'se-resize',
    leftOrRight: 'ew-resize',
    topOrBottom: 'ns-resize'
});
/**
 * @param {?} edges
 * @param {?} cursors
 * @return {?}
 */
function getResizeCursor(edges, cursors) {
    if (edges.left && edges.top) {
        return cursors.topLeft;
    }
    else if (edges.right && edges.top) {
        return cursors.topRight;
    }
    else if (edges.left && edges.bottom) {
        return cursors.bottomLeft;
    }
    else if (edges.right && edges.bottom) {
        return cursors.bottomRight;
    }
    else if (edges.left || edges.right) {
        return cursors.leftOrRight;
    }
    else if (edges.top || edges.bottom) {
        return cursors.topOrBottom;
    }
    else {
        return '';
    }
}
/**
 * @param {?} __0
 * @return {?}
 */
function getEdgesDiff(_a) {
    var edges = _a.edges, initialRectangle = _a.initialRectangle, newRectangle = _a.newRectangle;
    var /** @type {?} */ edgesDiff = {};
    Object.keys(edges).forEach(function (edge) {
        edgesDiff[edge] = newRectangle[edge] - initialRectangle[edge];
    });
    return edgesDiff;
}
var RESIZE_ACTIVE_CLASS = 'resize-active';
var RESIZE_LEFT_HOVER_CLASS = 'resize-left-hover';
var RESIZE_RIGHT_HOVER_CLASS = 'resize-right-hover';
var RESIZE_TOP_HOVER_CLASS = 'resize-top-hover';
var RESIZE_BOTTOM_HOVER_CLASS = 'resize-bottom-hover';
var RESIZE_GHOST_ELEMENT_CLASS = 'resize-ghost-element';
var MOUSE_MOVE_THROTTLE_MS = 50;
/**
 * Place this on an element to make it resizable. For example:
 *
 * ```html
 * <div
 *   mwlResizable
 *   [resizeEdges]="{bottom: true, right: true, top: true, left: true}"
 *   [enableGhostResize]="true">
 * </div>
 * ```
 */
var ResizableDirective = /** @class */ (function () {
    /**
     * @hidden
     * @param {?} renderer
     * @param {?} elm
     * @param {?} zone
     */
    function ResizableDirective(renderer, elm, zone) {
        this.renderer = renderer;
        this.elm = elm;
        this.zone = zone;
        /**
         * The edges that an element can be resized from. Pass an object like `{top: true, bottom: false}`. By default no edges can be resized.
         */
        this.resizeEdges = {};
        /**
         * Set to `true` to enable a temporary resizing effect of the element in between the `resizeStart` and `resizeEnd` events.
         */
        this.enableGhostResize = false;
        /**
         * A snap grid that resize events will be locked to.
         *
         * e.g. to only allow the element to be resized every 10px set it to `{left: 10, right: 10}`
         */
        this.resizeSnapGrid = {};
        /**
         * The mouse cursors that will be set on the resize edges
         */
        this.resizeCursors = DEFAULT_RESIZE_CURSORS;
        /**
         * Mouse over thickness to active cursor.
         */
        this.resizeCursorPrecision = 3;
        /**
         * Define the positioning of the ghost element (can be fixed or absolute)
         */
        this.ghostElementPositioning = 'fixed';
        /**
         * Called when the mouse is pressed and a resize event is about to begin. `$event` is a `ResizeEvent` object.
         */
        this.resizeStart = new core.EventEmitter();
        /**
         * Called as the mouse is dragged after a resize event has begun. `$event` is a `ResizeEvent` object.
         */
        this.resizing = new core.EventEmitter();
        /**
         * Called after the mouse is released after a resize event. `$event` is a `ResizeEvent` object.
         */
        this.resizeEnd = new core.EventEmitter();
        /**
         * @hidden
         */
        this.mouseup = new Subject.Subject();
        /**
         * @hidden
         */
        this.mousedown = new Subject.Subject();
        /**
         * @hidden
         */
        this.mousemove = new Subject.Subject();
        this.pointerEventListenerSubscriptions = {};
        this.pointerEventListeners = PointerEventListeners.getInstance(renderer, zone);
    }
    /**
     * @hidden
     * @return {?}
     */
    ResizableDirective.prototype.ngOnInit = function () {
        var _this = this;
        // TODO - use some fancy Observable.merge's for this
        this.pointerEventListenerSubscriptions.pointerDown = this.pointerEventListeners.pointerDown.subscribe(function (_a) {
            var clientX = _a.clientX, clientY = _a.clientY;
            _this.mousedown.next({ clientX: clientX, clientY: clientY });
        });
        this.pointerEventListenerSubscriptions.pointerMove = this.pointerEventListeners.pointerMove.subscribe(function (_a) {
            var clientX = _a.clientX, clientY = _a.clientY, event = _a.event;
            _this.mousemove.next({ clientX: clientX, clientY: clientY, event: event });
        });
        this.pointerEventListenerSubscriptions.pointerUp = this.pointerEventListeners.pointerUp.subscribe(function (_a) {
            var clientX = _a.clientX, clientY = _a.clientY;
            _this.mouseup.next({ clientX: clientX, clientY: clientY });
        });
        var /** @type {?} */ currentResize;
        var /** @type {?} */ removeGhostElement = function () {
            if (currentResize && currentResize.clonedNode) {
                _this.elm.nativeElement.parentElement.removeChild(currentResize.clonedNode);
                _this.renderer.setStyle(_this.elm.nativeElement, 'visibility', 'inherit');
            }
        };
        var /** @type {?} */ mouseMove = this.mousemove.pipe(share.share());
        mouseMove.pipe(filter.filter(function () { return !!currentResize; })).subscribe(function (_a) {
            var event = _a.event;
            event.preventDefault();
        });
        mouseMove
            .pipe(throttle.throttle(function () { return interval.interval(MOUSE_MOVE_THROTTLE_MS); }))
            .subscribe(function (_a) {
            var clientX = _a.clientX, clientY = _a.clientY;
            var /** @type {?} */ resizeEdges = getResizeEdges({
                clientX: clientX,
                clientY: clientY,
                elm: _this.elm,
                allowedEdges: _this.resizeEdges,
                cursorPrecision: _this.resizeCursorPrecision
            });
            var /** @type {?} */ resizeCursors = Object.assign({}, DEFAULT_RESIZE_CURSORS, _this.resizeCursors);
            if (currentResize) {
                var /** @type {?} */ cursor = getResizeCursor(currentResize.edges, resizeCursors);
                _this.renderer.setStyle(document.body, 'cursor', cursor);
            }
            else {
                var /** @type {?} */ cursor = getResizeCursor(resizeEdges, resizeCursors);
                _this.renderer.setStyle(_this.elm.nativeElement, 'cursor', cursor);
            }
            _this.setElementClass(_this.elm, RESIZE_ACTIVE_CLASS, !!currentResize);
            _this.setElementClass(_this.elm, RESIZE_LEFT_HOVER_CLASS, resizeEdges.left === true);
            _this.setElementClass(_this.elm, RESIZE_RIGHT_HOVER_CLASS, resizeEdges.right === true);
            _this.setElementClass(_this.elm, RESIZE_TOP_HOVER_CLASS, resizeEdges.top === true);
            _this.setElementClass(_this.elm, RESIZE_BOTTOM_HOVER_CLASS, resizeEdges.bottom === true);
        });
        var /** @type {?} */ mousedrag = this.mousedown
            .pipe(mergeMap.mergeMap(function (startCoords) {
            /**
             * @param {?} moveCoords
             * @return {?}
             */
            function getDiff(moveCoords) {
                return {
                    clientX: moveCoords.clientX - startCoords.clientX,
                    clientY: moveCoords.clientY - startCoords.clientY
                };
            }
            var /** @type {?} */ getSnapGrid = function () {
                var /** @type {?} */ snapGrid = { x: 1, y: 1 };
                if (currentResize) {
                    if (_this.resizeSnapGrid.left && currentResize.edges.left) {
                        snapGrid.x = +_this.resizeSnapGrid.left;
                    }
                    else if (_this.resizeSnapGrid.right &&
                        currentResize.edges.right) {
                        snapGrid.x = +_this.resizeSnapGrid.right;
                    }
                    if (_this.resizeSnapGrid.top && currentResize.edges.top) {
                        snapGrid.y = +_this.resizeSnapGrid.top;
                    }
                    else if (_this.resizeSnapGrid.bottom &&
                        currentResize.edges.bottom) {
                        snapGrid.y = +_this.resizeSnapGrid.bottom;
                    }
                }
                return snapGrid;
            };
            /**
             * @param {?} coords
             * @param {?} snapGrid
             * @return {?}
             */
            function getGrid(coords, snapGrid) {
                return {
                    x: Math.ceil(coords.clientX / snapGrid.x),
                    y: Math.ceil(coords.clientY / snapGrid.y)
                };
            }
            return merge.merge(mouseMove.pipe(take.take(1)).pipe(map.map(function (coords) { return [, coords]; })), mouseMove.pipe(pairwise.pairwise()))
                .pipe(map.map(function (_a) {
                var previousCoords = _a[0], newCoords = _a[1];
                return [
                    previousCoords ? getDiff(previousCoords) : previousCoords,
                    getDiff(newCoords)
                ];
            }))
                .pipe(filter.filter(function (_a) {
                var previousCoords = _a[0], newCoords = _a[1];
                if (!previousCoords) {
                    return true;
                }
                var /** @type {?} */ snapGrid = getSnapGrid();
                var /** @type {?} */ previousGrid = getGrid(previousCoords, snapGrid);
                var /** @type {?} */ newGrid = getGrid(newCoords, snapGrid);
                return (previousGrid.x !== newGrid.x || previousGrid.y !== newGrid.y);
            }))
                .pipe(map.map(function (_a) {
                var newCoords = _a[1];
                var /** @type {?} */ snapGrid = getSnapGrid();
                return {
                    clientX: Math.round(newCoords.clientX / snapGrid.x) * snapGrid.x,
                    clientY: Math.round(newCoords.clientY / snapGrid.y) * snapGrid.y
                };
            }))
                .pipe(takeUntil.takeUntil(merge.merge(_this.mouseup, _this.mousedown)));
        }))
            .pipe(filter.filter(function () { return !!currentResize; }));
        mousedrag
            .pipe(map.map(function (_a) {
            var clientX = _a.clientX, clientY = _a.clientY;
            return getNewBoundingRectangle(/** @type {?} */ ((currentResize)).startingRect, /** @type {?} */ ((currentResize)).edges, clientX, clientY);
        }))
            .pipe(filter.filter(function (newBoundingRect) {
            return !!(newBoundingRect.height &&
                newBoundingRect.width &&
                newBoundingRect.height > 0 &&
                newBoundingRect.width > 0);
        }))
            .pipe(filter.filter(function (newBoundingRect) {
            return _this.validateResize
                ? _this.validateResize({
                    rectangle: newBoundingRect,
                    edges: getEdgesDiff({
                        edges: /** @type {?} */ ((currentResize)).edges,
                        initialRectangle: /** @type {?} */ ((currentResize)).startingRect,
                        newRectangle: newBoundingRect
                    })
                })
                : true;
        }))
            .subscribe(function (newBoundingRect) {
            if (currentResize && currentResize.clonedNode) {
                _this.renderer.setStyle(currentResize.clonedNode, 'height', newBoundingRect.height + "px");
                _this.renderer.setStyle(currentResize.clonedNode, 'width', newBoundingRect.width + "px");
                _this.renderer.setStyle(currentResize.clonedNode, 'top', newBoundingRect.top + "px");
                _this.renderer.setStyle(currentResize.clonedNode, 'left', newBoundingRect.left + "px");
            }
            _this.zone.run(function () {
                _this.resizing.emit({
                    edges: getEdgesDiff({
                        edges: /** @type {?} */ ((currentResize)).edges,
                        initialRectangle: /** @type {?} */ ((currentResize)).startingRect,
                        newRectangle: newBoundingRect
                    }),
                    rectangle: newBoundingRect
                });
            }); /** @type {?} */
            ((currentResize)).currentRect = newBoundingRect;
        });
        this.mousedown
            .pipe(map.map(function (_a) {
            var clientX = _a.clientX, clientY = _a.clientY, edges = _a.edges;
            return (edges ||
                getResizeEdges({
                    clientX: clientX,
                    clientY: clientY,
                    elm: _this.elm,
                    allowedEdges: _this.resizeEdges,
                    cursorPrecision: _this.resizeCursorPrecision
                }));
        }))
            .pipe(filter.filter(function (edges) {
            return Object.keys(edges).length > 0;
        }))
            .subscribe(function (edges) {
            if (currentResize) {
                removeGhostElement();
            }
            var /** @type {?} */ startingRect = getElementRect(_this.elm, _this.ghostElementPositioning);
            currentResize = {
                edges: edges,
                startingRect: startingRect,
                currentRect: startingRect
            };
            if (_this.enableGhostResize) {
                currentResize.clonedNode = _this.elm.nativeElement.cloneNode(true);
                var /** @type {?} */ resizeCursors = Object.assign({}, DEFAULT_RESIZE_CURSORS, _this.resizeCursors);
                _this.elm.nativeElement.parentElement.appendChild(currentResize.clonedNode);
                _this.renderer.setStyle(_this.elm.nativeElement, 'visibility', 'hidden');
                _this.renderer.setStyle(currentResize.clonedNode, 'position', _this.ghostElementPositioning);
                _this.renderer.setStyle(currentResize.clonedNode, 'left', currentResize.startingRect.left + "px");
                _this.renderer.setStyle(currentResize.clonedNode, 'top', currentResize.startingRect.top + "px");
                _this.renderer.setStyle(currentResize.clonedNode, 'height', currentResize.startingRect.height + "px");
                _this.renderer.setStyle(currentResize.clonedNode, 'width', currentResize.startingRect.width + "px");
                _this.renderer.setStyle(currentResize.clonedNode, 'cursor', getResizeCursor(currentResize.edges, resizeCursors));
                _this.renderer.addClass(currentResize.clonedNode, RESIZE_GHOST_ELEMENT_CLASS); /** @type {?} */
                ((currentResize.clonedNode)).scrollTop = /** @type {?} */ (currentResize.startingRect
                    .scrollTop); /** @type {?} */
                ((currentResize.clonedNode)).scrollLeft = /** @type {?} */ (currentResize.startingRect
                    .scrollLeft);
            }
            _this.zone.run(function () {
                _this.resizeStart.emit({
                    edges: getEdgesDiff({
                        edges: edges,
                        initialRectangle: startingRect,
                        newRectangle: startingRect
                    }),
                    rectangle: getNewBoundingRectangle(startingRect, {}, 0, 0)
                });
            });
        });
        this.mouseup.subscribe(function () {
            if (currentResize) {
                _this.renderer.removeClass(_this.elm.nativeElement, RESIZE_ACTIVE_CLASS);
                _this.renderer.setStyle(document.body, 'cursor', '');
                _this.renderer.setStyle(_this.elm.nativeElement, 'cursor', '');
                _this.zone.run(function () {
                    _this.resizeEnd.emit({
                        edges: getEdgesDiff({
                            edges: /** @type {?} */ ((currentResize)).edges,
                            initialRectangle: /** @type {?} */ ((currentResize)).startingRect,
                            newRectangle: /** @type {?} */ ((currentResize)).currentRect
                        }),
                        rectangle: /** @type {?} */ ((currentResize)).currentRect
                    });
                });
                removeGhostElement();
                currentResize = null;
            }
        });
    };
    /**
     * @hidden
     * @return {?}
     */
    ResizableDirective.prototype.ngOnDestroy = function () {
        this.mousedown.complete();
        this.mouseup.complete();
        this.mousemove.complete();
        this.pointerEventListenerSubscriptions.pointerDown.unsubscribe();
        this.pointerEventListenerSubscriptions.pointerMove.unsubscribe();
        this.pointerEventListenerSubscriptions.pointerUp.unsubscribe();
    };
    /**
     * @param {?} elm
     * @param {?} name
     * @param {?} add
     * @return {?}
     */
    ResizableDirective.prototype.setElementClass = function (elm, name, add) {
        if (add) {
            this.renderer.addClass(elm.nativeElement, name);
        }
        else {
            this.renderer.removeClass(elm.nativeElement, name);
        }
    };
    return ResizableDirective;
}());
ResizableDirective.decorators = [
    { type: core.Directive, args: [{
                selector: '[mwlResizable]'
            },] },
];
/** @nocollapse */
ResizableDirective.ctorParameters = function () { return [
    { type: core.Renderer2, },
    { type: core.ElementRef, },
    { type: core.NgZone, },
]; };
ResizableDirective.propDecorators = {
    "validateResize": [{ type: core.Input },],
    "resizeEdges": [{ type: core.Input },],
    "enableGhostResize": [{ type: core.Input },],
    "resizeSnapGrid": [{ type: core.Input },],
    "resizeCursors": [{ type: core.Input },],
    "resizeCursorPrecision": [{ type: core.Input },],
    "ghostElementPositioning": [{ type: core.Input },],
    "resizeStart": [{ type: core.Output },],
    "resizing": [{ type: core.Output },],
    "resizeEnd": [{ type: core.Output },],
};
var PointerEventListeners = /** @class */ (function () {
    /**
     * @param {?} renderer
     * @param {?} zone
     */
    function PointerEventListeners(renderer, zone) {
        this.pointerDown = new Observable.Observable(function (observer) {
            var /** @type {?} */ unsubscribeMouseDown;
            var /** @type {?} */ unsubscribeTouchStart;
            zone.runOutsideAngular(function () {
                unsubscribeMouseDown = renderer.listen('document', 'mousedown', function (event) {
                    observer.next({
                        clientX: event.clientX,
                        clientY: event.clientY,
                        event: event
                    });
                });
                unsubscribeTouchStart = renderer.listen('document', 'touchstart', function (event) {
                    observer.next({
                        clientX: event.touches[0].clientX,
                        clientY: event.touches[0].clientY,
                        event: event
                    });
                });
            });
            return function () {
                unsubscribeMouseDown();
                unsubscribeTouchStart();
            };
        }).pipe(share.share());
        this.pointerMove = new Observable.Observable(function (observer) {
            var /** @type {?} */ unsubscribeMouseMove;
            var /** @type {?} */ unsubscribeTouchMove;
            zone.runOutsideAngular(function () {
                unsubscribeMouseMove = renderer.listen('document', 'mousemove', function (event) {
                    observer.next({
                        clientX: event.clientX,
                        clientY: event.clientY,
                        event: event
                    });
                });
                unsubscribeTouchMove = renderer.listen('document', 'touchmove', function (event) {
                    observer.next({
                        clientX: event.targetTouches[0].clientX,
                        clientY: event.targetTouches[0].clientY,
                        event: event
                    });
                });
            });
            return function () {
                unsubscribeMouseMove();
                unsubscribeTouchMove();
            };
        }).pipe(share.share());
        this.pointerUp = new Observable.Observable(function (observer) {
            var /** @type {?} */ unsubscribeMouseUp;
            var /** @type {?} */ unsubscribeTouchEnd;
            var /** @type {?} */ unsubscribeTouchCancel;
            zone.runOutsideAngular(function () {
                unsubscribeMouseUp = renderer.listen('document', 'mouseup', function (event) {
                    observer.next({
                        clientX: event.clientX,
                        clientY: event.clientY,
                        event: event
                    });
                });
                unsubscribeTouchEnd = renderer.listen('document', 'touchend', function (event) {
                    observer.next({
                        clientX: event.changedTouches[0].clientX,
                        clientY: event.changedTouches[0].clientY,
                        event: event
                    });
                });
                unsubscribeTouchCancel = renderer.listen('document', 'touchcancel', function (event) {
                    observer.next({
                        clientX: event.changedTouches[0].clientX,
                        clientY: event.changedTouches[0].clientY,
                        event: event
                    });
                });
            });
            return function () {
                unsubscribeMouseUp();
                unsubscribeTouchEnd();
                unsubscribeTouchCancel();
            };
        }).pipe(share.share());
    }
    /**
     * @param {?} renderer
     * @param {?} zone
     * @return {?}
     */
    PointerEventListeners.getInstance = function (renderer, zone) {
        if (!PointerEventListeners.instance) {
            PointerEventListeners.instance = new PointerEventListeners(renderer, zone);
        }
        return PointerEventListeners.instance;
    };
    return PointerEventListeners;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * An element placed inside a `mwlResizable` directive to be used as a drag and resize handle
 *
 * For example
 *
 * ```html
 * <div mwlResizable>
 *   <div mwlResizeHandle [resizeEdges]="{bottom: true, right: true}"></div>
 * </div>
 * ```
 */
var ResizeHandleDirective = /** @class */ (function () {
    /**
     * @param {?} renderer
     * @param {?} element
     * @param {?} zone
     * @param {?} resizable
     */
    function ResizeHandleDirective(renderer, element, zone, resizable) {
        this.renderer = renderer;
        this.element = element;
        this.zone = zone;
        this.resizable = resizable;
        /**
         * The `Edges` object that contains the edges of the parent element that dragging the handle will trigger a resize on
         */
        this.resizeEdges = {};
        this.eventListeners = {};
    }
    /**
     * @return {?}
     */
    ResizeHandleDirective.prototype.ngOnDestroy = function () {
        this.unsubscribeEventListeners();
    };
    /**
     * @hidden
     * @param {?} event
     * @param {?} clientX
     * @param {?} clientY
     * @return {?}
     */
    ResizeHandleDirective.prototype.onMousedown = function (event, clientX, clientY) {
        var _this = this;
        event.preventDefault();
        this.zone.runOutsideAngular(function () {
            if (!_this.eventListeners.touchmove) {
                _this.eventListeners.touchmove = _this.renderer.listen(_this.element.nativeElement, 'touchmove', function (touchMoveEvent) {
                    _this.onMousemove(touchMoveEvent, touchMoveEvent.targetTouches[0].clientX, touchMoveEvent.targetTouches[0].clientY);
                });
            }
            if (!_this.eventListeners.mousemove) {
                _this.eventListeners.mousemove = _this.renderer.listen(_this.element.nativeElement, 'mousemove', function (mouseMoveEvent) {
                    _this.onMousemove(mouseMoveEvent, mouseMoveEvent.clientX, mouseMoveEvent.clientY);
                });
            }
            _this.resizable.mousedown.next({
                clientX: clientX,
                clientY: clientY,
                edges: _this.resizeEdges
            });
        });
    };
    /**
     * @hidden
     * @param {?} clientX
     * @param {?} clientY
     * @return {?}
     */
    ResizeHandleDirective.prototype.onMouseup = function (clientX, clientY) {
        var _this = this;
        this.zone.runOutsideAngular(function () {
            _this.unsubscribeEventListeners();
            _this.resizable.mouseup.next({
                clientX: clientX,
                clientY: clientY,
                edges: _this.resizeEdges
            });
        });
    };
    /**
     * @param {?} event
     * @param {?} clientX
     * @param {?} clientY
     * @return {?}
     */
    ResizeHandleDirective.prototype.onMousemove = function (event, clientX, clientY) {
        this.resizable.mousemove.next({
            clientX: clientX,
            clientY: clientY,
            edges: this.resizeEdges,
            event: event
        });
    };
    /**
     * @return {?}
     */
    ResizeHandleDirective.prototype.unsubscribeEventListeners = function () {
        var _this = this;
        Object.keys(this.eventListeners).forEach(function (type) {
            ((_this)).eventListeners[type]();
            delete _this.eventListeners[type];
        });
    };
    return ResizeHandleDirective;
}());
ResizeHandleDirective.decorators = [
    { type: core.Directive, args: [{
                selector: '[mwlResizeHandle]'
            },] },
];
/** @nocollapse */
ResizeHandleDirective.ctorParameters = function () { return [
    { type: core.Renderer2, },
    { type: core.ElementRef, },
    { type: core.NgZone, },
    { type: ResizableDirective, },
]; };
ResizeHandleDirective.propDecorators = {
    "resizeEdges": [{ type: core.Input },],
    "onMousedown": [{ type: core.HostListener, args: ['touchstart', [
                    '$event',
                    '$event.touches[0].clientX',
                    '$event.touches[0].clientY'
                ],] }, { type: core.HostListener, args: ['mousedown', ['$event', '$event.clientX', '$event.clientY'],] },],
    "onMouseup": [{ type: core.HostListener, args: ['touchend', [
                    '$event.changedTouches[0].clientX',
                    '$event.changedTouches[0].clientY'
                ],] }, { type: core.HostListener, args: ['touchcancel', [
                    '$event.changedTouches[0].clientX',
                    '$event.changedTouches[0].clientY'
                ],] }, { type: core.HostListener, args: ['mouseup', ['$event.clientX', '$event.clientY'],] },],
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var ResizableModule = /** @class */ (function () {
    function ResizableModule() {
    }
    return ResizableModule;
}());
ResizableModule.decorators = [
    { type: core.NgModule, args: [{
                declarations: [ResizableDirective, ResizeHandleDirective],
                exports: [ResizableDirective, ResizeHandleDirective]
            },] },
];
/** @nocollapse */
ResizableModule.ctorParameters = function () { return []; };

exports.ResizableDirective = ResizableDirective;
exports.ResizeHandleDirective = ResizeHandleDirective;
exports.ResizableModule = ResizableModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=angular-resizable-element.umd.js.map
