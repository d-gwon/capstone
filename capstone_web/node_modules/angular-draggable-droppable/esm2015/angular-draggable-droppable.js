import { Directive, ElementRef, EventEmitter, Input, NgModule, NgZone, Output, Renderer2 } from '@angular/core';
import { Subject as Subject$1 } from 'rxjs/Subject';
import { merge as merge$1 } from 'rxjs/observable/merge';
import { map as map$1 } from 'rxjs/operators/map';
import { mergeMap as mergeMap$1 } from 'rxjs/operators/mergeMap';
import { takeUntil as takeUntil$1 } from 'rxjs/operators/takeUntil';
import { take as take$1 } from 'rxjs/operators/take';
import { takeLast as takeLast$1 } from 'rxjs/operators/takeLast';
import { pairwise as pairwise$1 } from 'rxjs/operators/pairwise';
import { share as share$1 } from 'rxjs/operators/share';
import { filter as filter$1 } from 'rxjs/operators/filter';
import { distinctUntilChanged as distinctUntilChanged$1 } from 'rxjs/operators/distinctUntilChanged';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class DraggableHelper {
    constructor() {
        this.currentDrag = new Subject$1();
    }
}

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

const MOVE_CURSOR = 'move';
class DraggableDirective {
    /**
     * @hidden
     * @param {?} element
     * @param {?} renderer
     * @param {?} draggableHelper
     * @param {?} zone
     */
    constructor(element, renderer, draggableHelper, zone) {
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
        this.dragPointerDown = new EventEmitter();
        /**
         * Called when the element has started to be dragged.
         * Only called after at least one mouse or touch move event
         */
        this.dragStart = new EventEmitter();
        /**
         * Called when the element is being dragged
         */
        this.dragging = new EventEmitter();
        /**
         * Called after the element is dragged
         */
        this.dragEnd = new EventEmitter();
        /**
         * @hidden
         */
        this.pointerDown = new Subject$1();
        /**
         * @hidden
         */
        this.pointerMove = new Subject$1();
        /**
         * @hidden
         */
        this.pointerUp = new Subject$1();
        this.eventListenerSubscriptions = {};
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.checkEventListeners();
        const /** @type {?} */ pointerDrag = this.pointerDown
            .pipe(filter$1(() => this.canDrag()))
            .pipe(mergeMap$1((pointerDownEvent) => {
            const /** @type {?} */ currentDrag = new Subject$1();
            this.zone.run(() => {
                this.dragPointerDown.next({ x: 0, y: 0 });
            });
            const /** @type {?} */ pointerMove = this.pointerMove
                .pipe(map$1((pointerMoveEvent) => {
                pointerMoveEvent.event.preventDefault();
                return {
                    currentDrag,
                    x: pointerMoveEvent.clientX - pointerDownEvent.clientX,
                    y: pointerMoveEvent.clientY - pointerDownEvent.clientY,
                    clientX: pointerMoveEvent.clientX,
                    clientY: pointerMoveEvent.clientY
                };
            }))
                .pipe(map$1((moveData) => {
                if (this.dragSnapGrid.x) {
                    moveData.x =
                        Math.floor(moveData.x / this.dragSnapGrid.x) *
                            this.dragSnapGrid.x;
                }
                if (this.dragSnapGrid.y) {
                    moveData.y =
                        Math.floor(moveData.y / this.dragSnapGrid.y) *
                            this.dragSnapGrid.y;
                }
                return moveData;
            }))
                .pipe(map$1((moveData) => {
                if (!this.dragAxis.x) {
                    moveData.x = 0;
                }
                if (!this.dragAxis.y) {
                    moveData.y = 0;
                }
                return moveData;
            }))
                .pipe(filter$1(({ x, y }) => !this.validateDrag || this.validateDrag({ x, y })))
                .pipe(takeUntil$1(merge$1(this.pointerUp, this.pointerDown)))
                .pipe(share$1());
            pointerMove.pipe(take$1(1)).subscribe(() => {
                pointerDownEvent.event.preventDefault();
                this.zone.run(() => {
                    this.dragStart.next({ x: 0, y: 0 });
                });
                this.setCursor(this.dragCursor);
                this.draggableHelper.currentDrag.next(currentDrag);
            });
            pointerMove.pipe(takeLast$1(1)).subscribe(({ x, y }) => {
                this.zone.run(() => {
                    this.dragEnd.next({ x, y });
                });
                currentDrag.complete();
                this.setCssTransform(null);
                if (this.ghostDragEnabled) {
                    this.renderer.setStyle(this.element.nativeElement, 'pointerEvents', null);
                }
            });
            return pointerMove;
        }))
            .pipe(share$1());
        merge$1(pointerDrag.pipe(take$1(1)).pipe(map$1(value => [, value])), pointerDrag.pipe(pairwise$1()))
            .pipe(filter$1(([previous, next]) => {
            if (!previous) {
                return true;
            }
            return previous.x !== next.x || previous.y !== next.y;
        }))
            .pipe(map$1(([previous, next]) => next))
            .subscribe(({ x, y, currentDrag, clientX, clientY }) => {
            this.zone.run(() => {
                this.dragging.next({ x, y });
            });
            if (this.ghostDragEnabled) {
                this.renderer.setStyle(this.element.nativeElement, 'pointerEvents', 'none');
            }
            this.setCssTransform(`translate(${x}px, ${y}px)`);
            currentDrag.next({
                clientX,
                clientY,
                dropData: this.dropData
            });
        });
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['dragAxis']) {
            this.checkEventListeners();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.unsubscribeEventListeners();
        this.pointerDown.complete();
        this.pointerMove.complete();
        this.pointerUp.complete();
    }
    /**
     * @return {?}
     */
    checkEventListeners() {
        const /** @type {?} */ canDrag = this.canDrag();
        const /** @type {?} */ hasEventListeners = Object.keys(this.eventListenerSubscriptions).length > 0;
        if (canDrag && !hasEventListeners) {
            this.zone.runOutsideAngular(() => {
                this.eventListenerSubscriptions.mousedown = this.renderer.listen(this.element.nativeElement, 'mousedown', (event) => {
                    this.onMouseDown(event);
                });
                this.eventListenerSubscriptions.mouseup = this.renderer.listen('document', 'mouseup', (event) => {
                    this.onMouseUp(event);
                });
                this.eventListenerSubscriptions.touchstart = this.renderer.listen(this.element.nativeElement, 'touchstart', (event) => {
                    this.onTouchStart(event);
                });
                this.eventListenerSubscriptions.touchend = this.renderer.listen('document', 'touchend', (event) => {
                    this.onTouchEnd(event);
                });
                this.eventListenerSubscriptions.touchcancel = this.renderer.listen('document', 'touchcancel', (event) => {
                    this.onTouchEnd(event);
                });
                this.eventListenerSubscriptions.mouseenter = this.renderer.listen(this.element.nativeElement, 'mouseenter', () => {
                    this.onMouseEnter();
                });
                this.eventListenerSubscriptions.mouseleave = this.renderer.listen(this.element.nativeElement, 'mouseleave', () => {
                    this.onMouseLeave();
                });
            });
        }
        else if (!canDrag && hasEventListeners) {
            this.unsubscribeEventListeners();
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseDown(event) {
        if (!this.eventListenerSubscriptions.mousemove) {
            this.eventListenerSubscriptions.mousemove = this.renderer.listen('document', 'mousemove', (mouseMoveEvent) => {
                this.pointerMove.next({
                    event: mouseMoveEvent,
                    clientX: mouseMoveEvent.clientX,
                    clientY: mouseMoveEvent.clientY
                });
            });
        }
        this.pointerDown.next({
            event,
            clientX: event.clientX,
            clientY: event.clientY
        });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseUp(event) {
        if (this.eventListenerSubscriptions.mousemove) {
            this.eventListenerSubscriptions.mousemove();
            delete this.eventListenerSubscriptions.mousemove;
        }
        this.pointerUp.next({
            event,
            clientX: event.clientX,
            clientY: event.clientY
        });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onTouchStart(event) {
        if (!this.eventListenerSubscriptions.touchmove) {
            this.eventListenerSubscriptions.touchmove = this.renderer.listen('document', 'touchmove', (touchMoveEvent) => {
                this.pointerMove.next({
                    event: touchMoveEvent,
                    clientX: touchMoveEvent.targetTouches[0].clientX,
                    clientY: touchMoveEvent.targetTouches[0].clientY
                });
            });
        }
        this.pointerDown.next({
            event,
            clientX: event.touches[0].clientX,
            clientY: event.touches[0].clientY
        });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onTouchEnd(event) {
        if (this.eventListenerSubscriptions.touchmove) {
            this.eventListenerSubscriptions.touchmove();
            delete this.eventListenerSubscriptions.touchmove;
        }
        this.pointerUp.next({
            event,
            clientX: event.changedTouches[0].clientX,
            clientY: event.changedTouches[0].clientY
        });
    }
    /**
     * @return {?}
     */
    onMouseEnter() {
        this.setCursor(this.dragCursor);
    }
    /**
     * @return {?}
     */
    onMouseLeave() {
        this.setCursor(null);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setCssTransform(value) {
        if (this.ghostDragEnabled) {
            const /** @type {?} */ transformAttributes = [
                'transform',
                '-webkit-transform',
                '-ms-transform',
                '-moz-transform',
                '-o-transform'
            ];
            transformAttributes.forEach(transformAttribute => {
                this.renderer.setStyle(this.element.nativeElement, transformAttribute, value);
            });
        }
    }
    /**
     * @return {?}
     */
    canDrag() {
        return this.dragAxis.x || this.dragAxis.y;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setCursor(value) {
        this.renderer.setStyle(this.element.nativeElement, 'cursor', value);
    }
    /**
     * @return {?}
     */
    unsubscribeEventListeners() {
        Object.keys(this.eventListenerSubscriptions).forEach(type => {
            (/** @type {?} */ (this)).eventListenerSubscriptions[type]();
            delete (/** @type {?} */ (this)).eventListenerSubscriptions[type];
        });
    }
}
DraggableDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mwlDraggable]'
            },] },
];
/** @nocollapse */
DraggableDirective.ctorParameters = () => [
    { type: ElementRef, },
    { type: Renderer2, },
    { type: DraggableHelper, },
    { type: NgZone, },
];
DraggableDirective.propDecorators = {
    "dropData": [{ type: Input },],
    "dragAxis": [{ type: Input },],
    "dragSnapGrid": [{ type: Input },],
    "ghostDragEnabled": [{ type: Input },],
    "validateDrag": [{ type: Input },],
    "dragCursor": [{ type: Input },],
    "dragPointerDown": [{ type: Output },],
    "dragStart": [{ type: Output },],
    "dragging": [{ type: Output },],
    "dragEnd": [{ type: Output },],
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

class DroppableDirective {
    /**
     * @param {?} element
     * @param {?} draggableHelper
     * @param {?} zone
     */
    constructor(element, draggableHelper, zone) {
        this.element = element;
        this.draggableHelper = draggableHelper;
        this.zone = zone;
        /**
         * Called when a draggable element starts overlapping the element
         */
        this.dragEnter = new EventEmitter();
        /**
         * Called when a draggable element stops overlapping the element
         */
        this.dragLeave = new EventEmitter();
        /**
         * Called when a draggable element is moved over the element
         */
        this.dragOver = new EventEmitter();
        /**
         * Called when a draggable element is dropped on this element
         */
        this.drop = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        /**
         * @record
         */
        this.currentDragSubscription = this.draggableHelper.currentDrag.subscribe((drag) => {
            const /** @type {?} */ droppableRectangle = this.element.nativeElement.getBoundingClientRect();
            let /** @type {?} */ currentDragDropData;
            const /** @type {?} */ overlaps = drag.pipe(map$1(({ clientX, clientY, dropData }) => {
                currentDragDropData = dropData;
                return isCoordinateWithinRectangle(clientX, clientY, droppableRectangle);
            }));
            const /** @type {?} */ overlapsChanged = overlaps.pipe(distinctUntilChanged$1());
            let /** @type {?} */ dragOverActive; // TODO - see if there's a way of doing this via rxjs
            overlapsChanged
                .pipe(filter$1(overlapsNow => overlapsNow))
                .subscribe(() => {
                dragOverActive = true;
                this.zone.run(() => {
                    this.dragEnter.next({
                        dropData: currentDragDropData
                    });
                });
            });
            overlaps.pipe(filter$1(overlapsNow => overlapsNow)).subscribe(() => {
                this.zone.run(() => {
                    this.dragOver.next({
                        dropData: currentDragDropData
                    });
                });
            });
            overlapsChanged
                .pipe(pairwise$1())
                .pipe(filter$1(([didOverlap, overlapsNow]) => didOverlap && !overlapsNow))
                .subscribe(() => {
                dragOverActive = false;
                this.zone.run(() => {
                    this.dragLeave.next({
                        dropData: currentDragDropData
                    });
                });
            });
            drag.pipe(mergeMap$1(() => overlaps)).subscribe({
                complete: () => {
                    if (dragOverActive) {
                        this.zone.run(() => {
                            this.drop.next({
                                dropData: currentDragDropData
                            });
                        });
                    }
                }
            });
        });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.currentDragSubscription.unsubscribe();
    }
}
DroppableDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mwlDroppable]'
            },] },
];
/** @nocollapse */
DroppableDirective.ctorParameters = () => [
    { type: ElementRef, },
    { type: DraggableHelper, },
    { type: NgZone, },
];
DroppableDirective.propDecorators = {
    "dragEnter": [{ type: Output },],
    "dragLeave": [{ type: Output },],
    "dragOver": [{ type: Output },],
    "drop": [{ type: Output },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class DragAndDropModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: DragAndDropModule,
            providers: [DraggableHelper]
        };
    }
}
DragAndDropModule.decorators = [
    { type: NgModule, args: [{
                declarations: [DraggableDirective, DroppableDirective],
                exports: [DraggableDirective, DroppableDirective]
            },] },
];
/** @nocollapse */
DragAndDropModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { DragAndDropModule, DraggableHelper, DraggableDirective as ɵa, DroppableDirective as ɵb };
//# sourceMappingURL=angular-draggable-droppable.js.map
