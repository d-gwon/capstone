(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/Subject'), require('rxjs/observable/merge'), require('rxjs/operators/map'), require('rxjs/operators/mergeMap'), require('rxjs/operators/takeUntil'), require('rxjs/operators/take'), require('rxjs/operators/takeLast'), require('rxjs/operators/pairwise'), require('rxjs/operators/share'), require('rxjs/operators/filter'), require('rxjs/operators/distinctUntilChanged')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs/Subject', 'rxjs/observable/merge', 'rxjs/operators/map', 'rxjs/operators/mergeMap', 'rxjs/operators/takeUntil', 'rxjs/operators/take', 'rxjs/operators/takeLast', 'rxjs/operators/pairwise', 'rxjs/operators/share', 'rxjs/operators/filter', 'rxjs/operators/distinctUntilChanged'], factory) :
	(factory((global['angular-draggable-droppable'] = {}),global.ng.core,global.Rx,global.Rx.Observable,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype));
}(this, (function (exports,core,Subject,merge,map,mergeMap,takeUntil,take,takeLast,pairwise,share,filter,distinctUntilChanged) { 'use strict';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var DraggableHelper = /** @class */ (function () {
    function DraggableHelper() {
        this.currentDrag = new Subject.Subject();
    }
    return DraggableHelper;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */
/**
 * @record
 */
/**
 * @record
 */
/**
 * @record
 */
var MOVE_CURSOR = 'move';
var DraggableDirective = /** @class */ (function () {
    /**
     * @hidden
     * @param {?} element
     * @param {?} renderer
     * @param {?} draggableHelper
     * @param {?} zone
     */
    function DraggableDirective(element, renderer, draggableHelper, zone) {
        this.element = element;
        this.renderer = renderer;
        this.draggableHelper = draggableHelper;
        this.zone = zone;
        /**
         * The axis along which the element is draggable
         */
        this.dragAxis = { x: true, y: true };
        /**
         * Snap all drags to an x / y grid
         */
        this.dragSnapGrid = {};
        /**
         * Show a ghost element that shows the drag when dragging
         */
        this.ghostDragEnabled = true;
        /**
         * The cursor to use when dragging the element
         */
        this.dragCursor = MOVE_CURSOR;
        /**
         * Called when the element can be dragged along one axis and has the mouse or pointer device pressed on it
         */
        this.dragPointerDown = new core.EventEmitter();
        /**
         * Called when the element has started to be dragged.
         * Only called after at least one mouse or touch move event
         */
        this.dragStart = new core.EventEmitter();
        /**
         * Called when the element is being dragged
         */
        this.dragging = new core.EventEmitter();
        /**
         * Called after the element is dragged
         */
        this.dragEnd = new core.EventEmitter();
        /**
         * @hidden
         */
        this.pointerDown = new Subject.Subject();
        /**
         * @hidden
         */
        this.pointerMove = new Subject.Subject();
        /**
         * @hidden
         */
        this.pointerUp = new Subject.Subject();
        this.eventListenerSubscriptions = {};
    }
    /**
     * @return {?}
     */
    DraggableDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.checkEventListeners();
        var /** @type {?} */ pointerDrag = this.pointerDown
            .pipe(filter.filter(function () { return _this.canDrag(); }))
            .pipe(mergeMap.mergeMap(function (pointerDownEvent) {
            var /** @type {?} */ currentDrag = new Subject.Subject();
            _this.zone.run(function () {
                _this.dragPointerDown.next({ x: 0, y: 0 });
            });
            var /** @type {?} */ pointerMove = _this.pointerMove
                .pipe(map.map(function (pointerMoveEvent) {
                pointerMoveEvent.event.preventDefault();
                return {
                    currentDrag: currentDrag,
                    x: pointerMoveEvent.clientX - pointerDownEvent.clientX,
                    y: pointerMoveEvent.clientY - pointerDownEvent.clientY,
                    clientX: pointerMoveEvent.clientX,
                    clientY: pointerMoveEvent.clientY
                };
            }))
                .pipe(map.map(function (moveData) {
                if (_this.dragSnapGrid.x) {
                    moveData.x =
                        Math.floor(moveData.x / _this.dragSnapGrid.x) *
                            _this.dragSnapGrid.x;
                }
                if (_this.dragSnapGrid.y) {
                    moveData.y =
                        Math.floor(moveData.y / _this.dragSnapGrid.y) *
                            _this.dragSnapGrid.y;
                }
                return moveData;
            }))
                .pipe(map.map(function (moveData) {
                if (!_this.dragAxis.x) {
                    moveData.x = 0;
                }
                if (!_this.dragAxis.y) {
                    moveData.y = 0;
                }
                return moveData;
            }))
                .pipe(filter.filter(function (_a) {
                var x = _a.x, y = _a.y;
                return !_this.validateDrag || _this.validateDrag({ x: x, y: y });
            }))
                .pipe(takeUntil.takeUntil(merge.merge(_this.pointerUp, _this.pointerDown)))
                .pipe(share.share());
            pointerMove.pipe(take.take(1)).subscribe(function () {
                pointerDownEvent.event.preventDefault();
                _this.zone.run(function () {
                    _this.dragStart.next({ x: 0, y: 0 });
                });
                _this.setCursor(_this.dragCursor);
                _this.draggableHelper.currentDrag.next(currentDrag);
            });
            pointerMove.pipe(takeLast.takeLast(1)).subscribe(function (_a) {
                var x = _a.x, y = _a.y;
                _this.zone.run(function () {
                    _this.dragEnd.next({ x: x, y: y });
                });
                currentDrag.complete();
                _this.setCssTransform(null);
                if (_this.ghostDragEnabled) {
                    _this.renderer.setStyle(_this.element.nativeElement, 'pointerEvents', null);
                }
            });
            return pointerMove;
        }))
            .pipe(share.share());
        merge.merge(pointerDrag.pipe(take.take(1)).pipe(map.map(function (value) { return [, value]; })), pointerDrag.pipe(pairwise.pairwise()))
            .pipe(filter.filter(function (_a) {
            var previous = _a[0], next = _a[1];
            if (!previous) {
                return true;
            }
            return previous.x !== next.x || previous.y !== next.y;
        }))
            .pipe(map.map(function (_a) {
            var previous = _a[0], next = _a[1];
            return next;
        }))
            .subscribe(function (_a) {
            var x = _a.x, y = _a.y, currentDrag = _a.currentDrag, clientX = _a.clientX, clientY = _a.clientY;
            _this.zone.run(function () {
                _this.dragging.next({ x: x, y: y });
            });
            if (_this.ghostDragEnabled) {
                _this.renderer.setStyle(_this.element.nativeElement, 'pointerEvents', 'none');
            }
            _this.setCssTransform("translate(" + x + "px, " + y + "px)");
            currentDrag.next({
                clientX: clientX,
                clientY: clientY,
                dropData: _this.dropData
            });
        });
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    DraggableDirective.prototype.ngOnChanges = function (changes) {
        if (changes['dragAxis']) {
            this.checkEventListeners();
        }
    };
    /**
     * @return {?}
     */
    DraggableDirective.prototype.ngOnDestroy = function () {
        this.unsubscribeEventListeners();
        this.pointerDown.complete();
        this.pointerMove.complete();
        this.pointerUp.complete();
    };
    /**
     * @return {?}
     */
    DraggableDirective.prototype.checkEventListeners = function () {
        var _this = this;
        var /** @type {?} */ canDrag = this.canDrag();
        var /** @type {?} */ hasEventListeners = Object.keys(this.eventListenerSubscriptions).length > 0;
        if (canDrag && !hasEventListeners) {
            this.zone.runOutsideAngular(function () {
                _this.eventListenerSubscriptions.mousedown = _this.renderer.listen(_this.element.nativeElement, 'mousedown', function (event) {
                    _this.onMouseDown(event);
                });
                _this.eventListenerSubscriptions.mouseup = _this.renderer.listen('document', 'mouseup', function (event) {
                    _this.onMouseUp(event);
                });
                _this.eventListenerSubscriptions.touchstart = _this.renderer.listen(_this.element.nativeElement, 'touchstart', function (event) {
                    _this.onTouchStart(event);
                });
                _this.eventListenerSubscriptions.touchend = _this.renderer.listen('document', 'touchend', function (event) {
                    _this.onTouchEnd(event);
                });
                _this.eventListenerSubscriptions.touchcancel = _this.renderer.listen('document', 'touchcancel', function (event) {
                    _this.onTouchEnd(event);
                });
                _this.eventListenerSubscriptions.mouseenter = _this.renderer.listen(_this.element.nativeElement, 'mouseenter', function () {
                    _this.onMouseEnter();
                });
                _this.eventListenerSubscriptions.mouseleave = _this.renderer.listen(_this.element.nativeElement, 'mouseleave', function () {
                    _this.onMouseLeave();
                });
            });
        }
        else if (!canDrag && hasEventListeners) {
            this.unsubscribeEventListeners();
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    DraggableDirective.prototype.onMouseDown = function (event) {
        var _this = this;
        if (!this.eventListenerSubscriptions.mousemove) {
            this.eventListenerSubscriptions.mousemove = this.renderer.listen('document', 'mousemove', function (mouseMoveEvent) {
                _this.pointerMove.next({
                    event: mouseMoveEvent,
                    clientX: mouseMoveEvent.clientX,
                    clientY: mouseMoveEvent.clientY
                });
            });
        }
        this.pointerDown.next({
            event: event,
            clientX: event.clientX,
            clientY: event.clientY
        });
    };
    /**
     * @param {?} event
     * @return {?}
     */
    DraggableDirective.prototype.onMouseUp = function (event) {
        if (this.eventListenerSubscriptions.mousemove) {
            this.eventListenerSubscriptions.mousemove();
            delete this.eventListenerSubscriptions.mousemove;
        }
        this.pointerUp.next({
            event: event,
            clientX: event.clientX,
            clientY: event.clientY
        });
    };
    /**
     * @param {?} event
     * @return {?}
     */
    DraggableDirective.prototype.onTouchStart = function (event) {
        var _this = this;
        if (!this.eventListenerSubscriptions.touchmove) {
            this.eventListenerSubscriptions.touchmove = this.renderer.listen('document', 'touchmove', function (touchMoveEvent) {
                _this.pointerMove.next({
                    event: touchMoveEvent,
                    clientX: touchMoveEvent.targetTouches[0].clientX,
                    clientY: touchMoveEvent.targetTouches[0].clientY
                });
            });
        }
        this.pointerDown.next({
            event: event,
            clientX: event.touches[0].clientX,
            clientY: event.touches[0].clientY
        });
    };
    /**
     * @param {?} event
     * @return {?}
     */
    DraggableDirective.prototype.onTouchEnd = function (event) {
        if (this.eventListenerSubscriptions.touchmove) {
            this.eventListenerSubscriptions.touchmove();
            delete this.eventListenerSubscriptions.touchmove;
        }
        this.pointerUp.next({
            event: event,
            clientX: event.changedTouches[0].clientX,
            clientY: event.changedTouches[0].clientY
        });
    };
    /**
     * @return {?}
     */
    DraggableDirective.prototype.onMouseEnter = function () {
        this.setCursor(this.dragCursor);
    };
    /**
     * @return {?}
     */
    DraggableDirective.prototype.onMouseLeave = function () {
        this.setCursor(null);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    DraggableDirective.prototype.setCssTransform = function (value) {
        var _this = this;
        if (this.ghostDragEnabled) {
            var /** @type {?} */ transformAttributes = [
                'transform',
                '-webkit-transform',
                '-ms-transform',
                '-moz-transform',
                '-o-transform'
            ];
            transformAttributes.forEach(function (transformAttribute) {
                _this.renderer.setStyle(_this.element.nativeElement, transformAttribute, value);
            });
        }
    };
    /**
     * @return {?}
     */
    DraggableDirective.prototype.canDrag = function () {
        return this.dragAxis.x || this.dragAxis.y;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    DraggableDirective.prototype.setCursor = function (value) {
        this.renderer.setStyle(this.element.nativeElement, 'cursor', value);
    };
    /**
     * @return {?}
     */
    DraggableDirective.prototype.unsubscribeEventListeners = function () {
        var _this = this;
        Object.keys(this.eventListenerSubscriptions).forEach(function (type) {
            ((_this)).eventListenerSubscriptions[type]();
            delete ((_this)).eventListenerSubscriptions[type];
        });
    };
    return DraggableDirective;
}());
DraggableDirective.decorators = [
    { type: core.Directive, args: [{
                selector: '[mwlDraggable]'
            },] },
];
/** @nocollapse */
DraggableDirective.ctorParameters = function () { return [
    { type: core.ElementRef, },
    { type: core.Renderer2, },
    { type: DraggableHelper, },
    { type: core.NgZone, },
]; };
DraggableDirective.propDecorators = {
    "dropData": [{ type: core.Input },],
    "dragAxis": [{ type: core.Input },],
    "dragSnapGrid": [{ type: core.Input },],
    "ghostDragEnabled": [{ type: core.Input },],
    "validateDrag": [{ type: core.Input },],
    "dragCursor": [{ type: core.Input },],
    "dragPointerDown": [{ type: core.Output },],
    "dragStart": [{ type: core.Output },],
    "dragging": [{ type: core.Output },],
    "dragEnd": [{ type: core.Output },],
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} clientX
 * @param {?} clientY
 * @param {?} rect
 * @return {?}
 */
function isCoordinateWithinRectangle(clientX, clientY, rect) {
    return (clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom);
}
/**
 * @record
 */
var DroppableDirective = /** @class */ (function () {
    /**
     * @param {?} element
     * @param {?} draggableHelper
     * @param {?} zone
     */
    function DroppableDirective(element, draggableHelper, zone) {
        this.element = element;
        this.draggableHelper = draggableHelper;
        this.zone = zone;
        /**
         * Called when a draggable element starts overlapping the element
         */
        this.dragEnter = new core.EventEmitter();
        /**
         * Called when a draggable element stops overlapping the element
         */
        this.dragLeave = new core.EventEmitter();
        /**
         * Called when a draggable element is moved over the element
         */
        this.dragOver = new core.EventEmitter();
        /**
         * Called when a draggable element is dropped on this element
         */
        this.drop = new core.EventEmitter();
    }
    /**
     * @return {?}
     */
    DroppableDirective.prototype.ngOnInit = function () {
        var _this = this;
        /**
         * @record
         */
        this.currentDragSubscription = this.draggableHelper.currentDrag.subscribe(function (drag) {
            var /** @type {?} */ droppableRectangle = _this.element.nativeElement.getBoundingClientRect();
            var /** @type {?} */ currentDragDropData;
            var /** @type {?} */ overlaps = drag.pipe(map.map(function (_a) {
                var clientX = _a.clientX, clientY = _a.clientY, dropData = _a.dropData;
                currentDragDropData = dropData;
                return isCoordinateWithinRectangle(clientX, clientY, droppableRectangle);
            }));
            var /** @type {?} */ overlapsChanged = overlaps.pipe(distinctUntilChanged.distinctUntilChanged());
            var /** @type {?} */ dragOverActive; // TODO - see if there's a way of doing this via rxjs
            overlapsChanged
                .pipe(filter.filter(function (overlapsNow) { return overlapsNow; }))
                .subscribe(function () {
                dragOverActive = true;
                _this.zone.run(function () {
                    _this.dragEnter.next({
                        dropData: currentDragDropData
                    });
                });
            });
            overlaps.pipe(filter.filter(function (overlapsNow) { return overlapsNow; })).subscribe(function () {
                _this.zone.run(function () {
                    _this.dragOver.next({
                        dropData: currentDragDropData
                    });
                });
            });
            overlapsChanged
                .pipe(pairwise.pairwise())
                .pipe(filter.filter(function (_a) {
                var didOverlap = _a[0], overlapsNow = _a[1];
                return didOverlap && !overlapsNow;
            }))
                .subscribe(function () {
                dragOverActive = false;
                _this.zone.run(function () {
                    _this.dragLeave.next({
                        dropData: currentDragDropData
                    });
                });
            });
            drag.pipe(mergeMap.mergeMap(function () { return overlaps; })).subscribe({
                complete: function () {
                    if (dragOverActive) {
                        _this.zone.run(function () {
                            _this.drop.next({
                                dropData: currentDragDropData
                            });
                        });
                    }
                }
            });
        });
    };
    /**
     * @return {?}
     */
    DroppableDirective.prototype.ngOnDestroy = function () {
        this.currentDragSubscription.unsubscribe();
    };
    return DroppableDirective;
}());
DroppableDirective.decorators = [
    { type: core.Directive, args: [{
                selector: '[mwlDroppable]'
            },] },
];
/** @nocollapse */
DroppableDirective.ctorParameters = function () { return [
    { type: core.ElementRef, },
    { type: DraggableHelper, },
    { type: core.NgZone, },
]; };
DroppableDirective.propDecorators = {
    "dragEnter": [{ type: core.Output },],
    "dragLeave": [{ type: core.Output },],
    "dragOver": [{ type: core.Output },],
    "drop": [{ type: core.Output },],
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var DragAndDropModule = /** @class */ (function () {
    function DragAndDropModule() {
    }
    /**
     * @return {?}
     */
    DragAndDropModule.forRoot = function () {
        return {
            ngModule: DragAndDropModule,
            providers: [DraggableHelper]
        };
    };
    return DragAndDropModule;
}());
DragAndDropModule.decorators = [
    { type: core.NgModule, args: [{
                declarations: [DraggableDirective, DroppableDirective],
                exports: [DraggableDirective, DroppableDirective]
            },] },
];
/** @nocollapse */
DragAndDropModule.ctorParameters = function () { return []; };

exports.DragAndDropModule = DragAndDropModule;
exports.DraggableHelper = DraggableHelper;
exports.ɵa = DraggableDirective;
exports.ɵb = DroppableDirective;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=angular-draggable-droppable.umd.js.map
