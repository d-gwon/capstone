import { Directive, ElementRef, EventEmitter, HostListener, Input, NgModule, NgZone, Output, Renderer2 } from '@angular/core';
import { Subject as Subject$1 } from 'rxjs/Subject';
import { Observable as Observable$1 } from 'rxjs/Observable';
import { merge as merge$1 } from 'rxjs/observable/merge';
import { interval as interval$1 } from 'rxjs/observable/interval';
import { map as map$1 } from 'rxjs/operators/map';
import { mergeMap as mergeMap$1 } from 'rxjs/operators/mergeMap';
import { takeUntil as takeUntil$1 } from 'rxjs/operators/takeUntil';
import { filter as filter$1 } from 'rxjs/operators/filter';
import { pairwise as pairwise$1 } from 'rxjs/operators/pairwise';
import { take as take$1 } from 'rxjs/operators/take';
import { throttle as throttle$1 } from 'rxjs/operators/throttle';
import { share as share$1 } from 'rxjs/operators/share';

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
function isNumberCloseTo(value1, value2, precision = 3) {
    const /** @type {?} */ diff = Math.abs(value1 - value2);
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
    const /** @type {?} */ newBoundingRect = {
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
    let /** @type {?} */ translateX = 0;
    let /** @type {?} */ translateY = 0;
    const /** @type {?} */ style = element.nativeElement.style;
    const /** @type {?} */ transformProperties = [
        'transform',
        '-ms-transform',
        '-moz-transform',
        '-o-transform'
    ];
    const /** @type {?} */ transform = transformProperties
        .map(property => style[property])
        .find(value => !!value);
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
        const /** @type {?} */ boundingRect = element.nativeElement.getBoundingClientRect();
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
function isWithinBoundingY({ clientY, rect }) {
    return clientY >= rect.top && clientY <= rect.bottom;
}
/**
 * @param {?} __0
 * @return {?}
 */
function isWithinBoundingX({ clientX, rect }) {
    return clientX >= rect.left && clientX <= rect.right;
}
/**
 * @param {?} __0
 * @return {?}
 */
function getResizeEdges({ clientX, clientY, elm, allowedEdges, cursorPrecision }) {
    const /** @type {?} */ elmPosition = elm.nativeElement.getBoundingClientRect();
    const /** @type {?} */ edges = {};
    if (allowedEdges.left &&
        isNumberCloseTo(clientX, elmPosition.left, cursorPrecision) &&
        isWithinBoundingY({ clientY, rect: elmPosition })) {
        edges.left = true;
    }
    if (allowedEdges.right &&
        isNumberCloseTo(clientX, elmPosition.right, cursorPrecision) &&
        isWithinBoundingY({ clientY, rect: elmPosition })) {
        edges.right = true;
    }
    if (allowedEdges.top &&
        isNumberCloseTo(clientY, elmPosition.top, cursorPrecision) &&
        isWithinBoundingX({ clientX, rect: elmPosition })) {
        edges.top = true;
    }
    if (allowedEdges.bottom &&
        isNumberCloseTo(clientY, elmPosition.bottom, cursorPrecision) &&
        isWithinBoundingX({ clientX, rect: elmPosition })) {
        edges.bottom = true;
    }
    return edges;
}
/**
 * @record
 */

const DEFAULT_RESIZE_CURSORS = Object.freeze({
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
function getEdgesDiff({ edges, initialRectangle, newRectangle }) {
    const /** @type {?} */ edgesDiff = {};
    Object.keys(edges).forEach((edge) => {
        edgesDiff[edge] = newRectangle[edge] - initialRectangle[edge];
    });
    return edgesDiff;
}
const RESIZE_ACTIVE_CLASS = 'resize-active';
const RESIZE_LEFT_HOVER_CLASS = 'resize-left-hover';
const RESIZE_RIGHT_HOVER_CLASS = 'resize-right-hover';
const RESIZE_TOP_HOVER_CLASS = 'resize-top-hover';
const RESIZE_BOTTOM_HOVER_CLASS = 'resize-bottom-hover';
const RESIZE_GHOST_ELEMENT_CLASS = 'resize-ghost-element';
const MOUSE_MOVE_THROTTLE_MS = 50;
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
class ResizableDirective {
    /**
     * @hidden
     * @param {?} renderer
     * @param {?} elm
     * @param {?} zone
     */
    constructor(renderer, elm, zone) {
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
        this.resizeStart = new EventEmitter();
        /**
         * Called as the mouse is dragged after a resize event has begun. `$event` is a `ResizeEvent` object.
         */
        this.resizing = new EventEmitter();
        /**
         * Called after the mouse is released after a resize event. `$event` is a `ResizeEvent` object.
         */
        this.resizeEnd = new EventEmitter();
        /**
         * @hidden
         */
        this.mouseup = new Subject$1();
        /**
         * @hidden
         */
        this.mousedown = new Subject$1();
        /**
         * @hidden
         */
        this.mousemove = new Subject$1();
        this.pointerEventListenerSubscriptions = {};
        this.pointerEventListeners = PointerEventListeners.getInstance(renderer, zone);
    }
    /**
     * @hidden
     * @return {?}
     */
    ngOnInit() {
        // TODO - use some fancy Observable.merge's for this
        this.pointerEventListenerSubscriptions.pointerDown = this.pointerEventListeners.pointerDown.subscribe(({ clientX, clientY }) => {
            this.mousedown.next({ clientX, clientY });
        });
        this.pointerEventListenerSubscriptions.pointerMove = this.pointerEventListeners.pointerMove.subscribe(({ clientX, clientY, event }) => {
            this.mousemove.next({ clientX, clientY, event });
        });
        this.pointerEventListenerSubscriptions.pointerUp = this.pointerEventListeners.pointerUp.subscribe(({ clientX, clientY }) => {
            this.mouseup.next({ clientX, clientY });
        });
        let /** @type {?} */ currentResize;
        const /** @type {?} */ removeGhostElement = () => {
            if (currentResize && currentResize.clonedNode) {
                this.elm.nativeElement.parentElement.removeChild(currentResize.clonedNode);
                this.renderer.setStyle(this.elm.nativeElement, 'visibility', 'inherit');
            }
        };
        const /** @type {?} */ mouseMove = this.mousemove.pipe(share$1());
        mouseMove.pipe(filter$1(() => !!currentResize)).subscribe(({ event }) => {
            event.preventDefault();
        });
        mouseMove
            .pipe(throttle$1(() => interval$1(MOUSE_MOVE_THROTTLE_MS)))
            .subscribe(({ clientX, clientY }) => {
            const /** @type {?} */ resizeEdges = getResizeEdges({
                clientX,
                clientY,
                elm: this.elm,
                allowedEdges: this.resizeEdges,
                cursorPrecision: this.resizeCursorPrecision
            });
            const /** @type {?} */ resizeCursors = Object.assign({}, DEFAULT_RESIZE_CURSORS, this.resizeCursors);
            if (currentResize) {
                const /** @type {?} */ cursor = getResizeCursor(currentResize.edges, resizeCursors);
                this.renderer.setStyle(document.body, 'cursor', cursor);
            }
            else {
                const /** @type {?} */ cursor = getResizeCursor(resizeEdges, resizeCursors);
                this.renderer.setStyle(this.elm.nativeElement, 'cursor', cursor);
            }
            this.setElementClass(this.elm, RESIZE_ACTIVE_CLASS, !!currentResize);
            this.setElementClass(this.elm, RESIZE_LEFT_HOVER_CLASS, resizeEdges.left === true);
            this.setElementClass(this.elm, RESIZE_RIGHT_HOVER_CLASS, resizeEdges.right === true);
            this.setElementClass(this.elm, RESIZE_TOP_HOVER_CLASS, resizeEdges.top === true);
            this.setElementClass(this.elm, RESIZE_BOTTOM_HOVER_CLASS, resizeEdges.bottom === true);
        });
        const /** @type {?} */ mousedrag = this.mousedown
            .pipe(mergeMap$1(startCoords => {
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
            const /** @type {?} */ getSnapGrid = () => {
                const /** @type {?} */ snapGrid = { x: 1, y: 1 };
                if (currentResize) {
                    if (this.resizeSnapGrid.left && currentResize.edges.left) {
                        snapGrid.x = +this.resizeSnapGrid.left;
                    }
                    else if (this.resizeSnapGrid.right &&
                        currentResize.edges.right) {
                        snapGrid.x = +this.resizeSnapGrid.right;
                    }
                    if (this.resizeSnapGrid.top && currentResize.edges.top) {
                        snapGrid.y = +this.resizeSnapGrid.top;
                    }
                    else if (this.resizeSnapGrid.bottom &&
                        currentResize.edges.bottom) {
                        snapGrid.y = +this.resizeSnapGrid.bottom;
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
            return merge$1(mouseMove.pipe(take$1(1)).pipe(map$1(coords => [, coords])), mouseMove.pipe(pairwise$1()))
                .pipe(map$1(([previousCoords, newCoords]) => {
                return [
                    previousCoords ? getDiff(previousCoords) : previousCoords,
                    getDiff(newCoords)
                ];
            }))
                .pipe(filter$1(([previousCoords, newCoords]) => {
                if (!previousCoords) {
                    return true;
                }
                const /** @type {?} */ snapGrid = getSnapGrid();
                const /** @type {?} */ previousGrid = getGrid(previousCoords, snapGrid);
                const /** @type {?} */ newGrid = getGrid(newCoords, snapGrid);
                return (previousGrid.x !== newGrid.x || previousGrid.y !== newGrid.y);
            }))
                .pipe(map$1(([, newCoords]) => {
                const /** @type {?} */ snapGrid = getSnapGrid();
                return {
                    clientX: Math.round(newCoords.clientX / snapGrid.x) * snapGrid.x,
                    clientY: Math.round(newCoords.clientY / snapGrid.y) * snapGrid.y
                };
            }))
                .pipe(takeUntil$1(merge$1(this.mouseup, this.mousedown)));
        }))
            .pipe(filter$1(() => !!currentResize));
        mousedrag
            .pipe(map$1(({ clientX, clientY }) => {
            return getNewBoundingRectangle(/** @type {?} */ ((currentResize)).startingRect, /** @type {?} */ ((currentResize)).edges, clientX, clientY);
        }))
            .pipe(filter$1((newBoundingRect) => {
            return !!(newBoundingRect.height &&
                newBoundingRect.width &&
                newBoundingRect.height > 0 &&
                newBoundingRect.width > 0);
        }))
            .pipe(filter$1((newBoundingRect) => {
            return this.validateResize
                ? this.validateResize({
                    rectangle: newBoundingRect,
                    edges: getEdgesDiff({
                        edges: /** @type {?} */ ((currentResize)).edges,
                        initialRectangle: /** @type {?} */ ((currentResize)).startingRect,
                        newRectangle: newBoundingRect
                    })
                })
                : true;
        }))
            .subscribe((newBoundingRect) => {
            if (currentResize && currentResize.clonedNode) {
                this.renderer.setStyle(currentResize.clonedNode, 'height', `${newBoundingRect.height}px`);
                this.renderer.setStyle(currentResize.clonedNode, 'width', `${newBoundingRect.width}px`);
                this.renderer.setStyle(currentResize.clonedNode, 'top', `${newBoundingRect.top}px`);
                this.renderer.setStyle(currentResize.clonedNode, 'left', `${newBoundingRect.left}px`);
            }
            this.zone.run(() => {
                this.resizing.emit({
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
            .pipe(map$1(({ clientX, clientY, edges }) => {
            return (edges ||
                getResizeEdges({
                    clientX,
                    clientY,
                    elm: this.elm,
                    allowedEdges: this.resizeEdges,
                    cursorPrecision: this.resizeCursorPrecision
                }));
        }))
            .pipe(filter$1((edges) => {
            return Object.keys(edges).length > 0;
        }))
            .subscribe((edges) => {
            if (currentResize) {
                removeGhostElement();
            }
            const /** @type {?} */ startingRect = getElementRect(this.elm, this.ghostElementPositioning);
            currentResize = {
                edges,
                startingRect,
                currentRect: startingRect
            };
            if (this.enableGhostResize) {
                currentResize.clonedNode = this.elm.nativeElement.cloneNode(true);
                const /** @type {?} */ resizeCursors = Object.assign({}, DEFAULT_RESIZE_CURSORS, this.resizeCursors);
                this.elm.nativeElement.parentElement.appendChild(currentResize.clonedNode);
                this.renderer.setStyle(this.elm.nativeElement, 'visibility', 'hidden');
                this.renderer.setStyle(currentResize.clonedNode, 'position', this.ghostElementPositioning);
                this.renderer.setStyle(currentResize.clonedNode, 'left', `${currentResize.startingRect.left}px`);
                this.renderer.setStyle(currentResize.clonedNode, 'top', `${currentResize.startingRect.top}px`);
                this.renderer.setStyle(currentResize.clonedNode, 'height', `${currentResize.startingRect.height}px`);
                this.renderer.setStyle(currentResize.clonedNode, 'width', `${currentResize.startingRect.width}px`);
                this.renderer.setStyle(currentResize.clonedNode, 'cursor', getResizeCursor(currentResize.edges, resizeCursors));
                this.renderer.addClass(currentResize.clonedNode, RESIZE_GHOST_ELEMENT_CLASS); /** @type {?} */
                ((currentResize.clonedNode)).scrollTop = /** @type {?} */ (currentResize.startingRect
                    .scrollTop); /** @type {?} */
                ((currentResize.clonedNode)).scrollLeft = /** @type {?} */ (currentResize.startingRect
                    .scrollLeft);
            }
            this.zone.run(() => {
                this.resizeStart.emit({
                    edges: getEdgesDiff({
                        edges,
                        initialRectangle: startingRect,
                        newRectangle: startingRect
                    }),
                    rectangle: getNewBoundingRectangle(startingRect, {}, 0, 0)
                });
            });
        });
        this.mouseup.subscribe(() => {
            if (currentResize) {
                this.renderer.removeClass(this.elm.nativeElement, RESIZE_ACTIVE_CLASS);
                this.renderer.setStyle(document.body, 'cursor', '');
                this.renderer.setStyle(this.elm.nativeElement, 'cursor', '');
                this.zone.run(() => {
                    this.resizeEnd.emit({
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
    }
    /**
     * @hidden
     * @return {?}
     */
    ngOnDestroy() {
        this.mousedown.complete();
        this.mouseup.complete();
        this.mousemove.complete();
        this.pointerEventListenerSubscriptions.pointerDown.unsubscribe();
        this.pointerEventListenerSubscriptions.pointerMove.unsubscribe();
        this.pointerEventListenerSubscriptions.pointerUp.unsubscribe();
    }
    /**
     * @param {?} elm
     * @param {?} name
     * @param {?} add
     * @return {?}
     */
    setElementClass(elm, name, add) {
        if (add) {
            this.renderer.addClass(elm.nativeElement, name);
        }
        else {
            this.renderer.removeClass(elm.nativeElement, name);
        }
    }
}
ResizableDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mwlResizable]'
            },] },
];
/** @nocollapse */
ResizableDirective.ctorParameters = () => [
    { type: Renderer2, },
    { type: ElementRef, },
    { type: NgZone, },
];
ResizableDirective.propDecorators = {
    "validateResize": [{ type: Input },],
    "resizeEdges": [{ type: Input },],
    "enableGhostResize": [{ type: Input },],
    "resizeSnapGrid": [{ type: Input },],
    "resizeCursors": [{ type: Input },],
    "resizeCursorPrecision": [{ type: Input },],
    "ghostElementPositioning": [{ type: Input },],
    "resizeStart": [{ type: Output },],
    "resizing": [{ type: Output },],
    "resizeEnd": [{ type: Output },],
};
class PointerEventListeners {
    /**
     * @param {?} renderer
     * @param {?} zone
     * @return {?}
     */
    static getInstance(renderer, zone) {
        if (!PointerEventListeners.instance) {
            PointerEventListeners.instance = new PointerEventListeners(renderer, zone);
        }
        return PointerEventListeners.instance;
    }
    /**
     * @param {?} renderer
     * @param {?} zone
     */
    constructor(renderer, zone) {
        this.pointerDown = new Observable$1((observer) => {
            let /** @type {?} */ unsubscribeMouseDown;
            let /** @type {?} */ unsubscribeTouchStart;
            zone.runOutsideAngular(() => {
                unsubscribeMouseDown = renderer.listen('document', 'mousedown', (event) => {
                    observer.next({
                        clientX: event.clientX,
                        clientY: event.clientY,
                        event
                    });
                });
                unsubscribeTouchStart = renderer.listen('document', 'touchstart', (event) => {
                    observer.next({
                        clientX: event.touches[0].clientX,
                        clientY: event.touches[0].clientY,
                        event
                    });
                });
            });
            return () => {
                unsubscribeMouseDown();
                unsubscribeTouchStart();
            };
        }).pipe(share$1());
        this.pointerMove = new Observable$1((observer) => {
            let /** @type {?} */ unsubscribeMouseMove;
            let /** @type {?} */ unsubscribeTouchMove;
            zone.runOutsideAngular(() => {
                unsubscribeMouseMove = renderer.listen('document', 'mousemove', (event) => {
                    observer.next({
                        clientX: event.clientX,
                        clientY: event.clientY,
                        event
                    });
                });
                unsubscribeTouchMove = renderer.listen('document', 'touchmove', (event) => {
                    observer.next({
                        clientX: event.targetTouches[0].clientX,
                        clientY: event.targetTouches[0].clientY,
                        event
                    });
                });
            });
            return () => {
                unsubscribeMouseMove();
                unsubscribeTouchMove();
            };
        }).pipe(share$1());
        this.pointerUp = new Observable$1((observer) => {
            let /** @type {?} */ unsubscribeMouseUp;
            let /** @type {?} */ unsubscribeTouchEnd;
            let /** @type {?} */ unsubscribeTouchCancel;
            zone.runOutsideAngular(() => {
                unsubscribeMouseUp = renderer.listen('document', 'mouseup', (event) => {
                    observer.next({
                        clientX: event.clientX,
                        clientY: event.clientY,
                        event
                    });
                });
                unsubscribeTouchEnd = renderer.listen('document', 'touchend', (event) => {
                    observer.next({
                        clientX: event.changedTouches[0].clientX,
                        clientY: event.changedTouches[0].clientY,
                        event
                    });
                });
                unsubscribeTouchCancel = renderer.listen('document', 'touchcancel', (event) => {
                    observer.next({
                        clientX: event.changedTouches[0].clientX,
                        clientY: event.changedTouches[0].clientY,
                        event
                    });
                });
            });
            return () => {
                unsubscribeMouseUp();
                unsubscribeTouchEnd();
                unsubscribeTouchCancel();
            };
        }).pipe(share$1());
    }
}

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
class ResizeHandleDirective {
    /**
     * @param {?} renderer
     * @param {?} element
     * @param {?} zone
     * @param {?} resizable
     */
    constructor(renderer, element, zone, resizable) {
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
    ngOnDestroy() {
        this.unsubscribeEventListeners();
    }
    /**
     * @hidden
     * @param {?} event
     * @param {?} clientX
     * @param {?} clientY
     * @return {?}
     */
    onMousedown(event, clientX, clientY) {
        event.preventDefault();
        this.zone.runOutsideAngular(() => {
            if (!this.eventListeners.touchmove) {
                this.eventListeners.touchmove = this.renderer.listen(this.element.nativeElement, 'touchmove', (touchMoveEvent) => {
                    this.onMousemove(touchMoveEvent, touchMoveEvent.targetTouches[0].clientX, touchMoveEvent.targetTouches[0].clientY);
                });
            }
            if (!this.eventListeners.mousemove) {
                this.eventListeners.mousemove = this.renderer.listen(this.element.nativeElement, 'mousemove', (mouseMoveEvent) => {
                    this.onMousemove(mouseMoveEvent, mouseMoveEvent.clientX, mouseMoveEvent.clientY);
                });
            }
            this.resizable.mousedown.next({
                clientX,
                clientY,
                edges: this.resizeEdges
            });
        });
    }
    /**
     * @hidden
     * @param {?} clientX
     * @param {?} clientY
     * @return {?}
     */
    onMouseup(clientX, clientY) {
        this.zone.runOutsideAngular(() => {
            this.unsubscribeEventListeners();
            this.resizable.mouseup.next({
                clientX,
                clientY,
                edges: this.resizeEdges
            });
        });
    }
    /**
     * @param {?} event
     * @param {?} clientX
     * @param {?} clientY
     * @return {?}
     */
    onMousemove(event, clientX, clientY) {
        this.resizable.mousemove.next({
            clientX,
            clientY,
            edges: this.resizeEdges,
            event
        });
    }
    /**
     * @return {?}
     */
    unsubscribeEventListeners() {
        Object.keys(this.eventListeners).forEach((type) => {
            (/** @type {?} */ (this)).eventListeners[type]();
            delete this.eventListeners[type];
        });
    }
}
ResizeHandleDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mwlResizeHandle]'
            },] },
];
/** @nocollapse */
ResizeHandleDirective.ctorParameters = () => [
    { type: Renderer2, },
    { type: ElementRef, },
    { type: NgZone, },
    { type: ResizableDirective, },
];
ResizeHandleDirective.propDecorators = {
    "resizeEdges": [{ type: Input },],
    "onMousedown": [{ type: HostListener, args: ['touchstart', [
                    '$event',
                    '$event.touches[0].clientX',
                    '$event.touches[0].clientY'
                ],] }, { type: HostListener, args: ['mousedown', ['$event', '$event.clientX', '$event.clientY'],] },],
    "onMouseup": [{ type: HostListener, args: ['touchend', [
                    '$event.changedTouches[0].clientX',
                    '$event.changedTouches[0].clientY'
                ],] }, { type: HostListener, args: ['touchcancel', [
                    '$event.changedTouches[0].clientX',
                    '$event.changedTouches[0].clientY'
                ],] }, { type: HostListener, args: ['mouseup', ['$event.clientX', '$event.clientY'],] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ResizableModule {
}
ResizableModule.decorators = [
    { type: NgModule, args: [{
                declarations: [ResizableDirective, ResizeHandleDirective],
                exports: [ResizableDirective, ResizeHandleDirective]
            },] },
];
/** @nocollapse */
ResizableModule.ctorParameters = () => [];

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

export { ResizableDirective, ResizeHandleDirective, ResizableModule };
//# sourceMappingURL=angular-resizable-element.js.map
