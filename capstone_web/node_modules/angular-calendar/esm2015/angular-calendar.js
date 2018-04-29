import { validateEvents, getMonthView, getWeekViewHeader, getWeekView, getDayView, getDayViewHourGrid } from 'calendar-utils';
export { DAYS_OF_WEEK } from 'calendar-utils';
import { Component, Input, Directive, HostListener, Injector, ComponentFactoryResolver, ViewContainerRef, ElementRef, Inject, Renderer2, Output, EventEmitter, Pipe, LOCALE_ID, Injectable, InjectionToken, NgModule, ChangeDetectorRef } from '@angular/core';
import { DOCUMENT, DatePipe, CommonModule } from '@angular/common';
import { Positioning } from 'positioning';
import subDays from 'date-fns/sub_days/index';
import subWeeks from 'date-fns/sub_weeks/index';
import subMonths from 'date-fns/sub_months/index';
import addDays from 'date-fns/add_days/index';
import addWeeks from 'date-fns/add_weeks/index';
import addMonths from 'date-fns/add_months/index';
import startOfToday from 'date-fns/start_of_today/index';
import getISOWeek from 'date-fns/get_iso_week/index';
import { DraggableHelper, DragAndDropModule } from 'angular-draggable-droppable';
import 'rxjs/Subject';
import isSameDay from 'date-fns/is_same_day/index';
import setDate from 'date-fns/set_date/index';
import setMonth from 'date-fns/set_month/index';
import setYear from 'date-fns/set_year/index';
import getDate from 'date-fns/get_date/index';
import getMonth from 'date-fns/get_month/index';
import getYear from 'date-fns/get_year/index';
import differenceInSeconds from 'date-fns/difference_in_seconds/index';
import addSeconds from 'date-fns/add_seconds/index';
import { trigger, style, transition, animate } from '@angular/animations';
import { ResizableModule } from 'angular-resizable-element';
import addMinutes from 'date-fns/add_minutes/index';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const validateEvents$1 = (events) => {
    const /** @type {?} */ warn = (...args) => console.warn('angular-calendar', ...args);
    return validateEvents(events, warn);
};
/**
 * @param {?} outer
 * @param {?} inner
 * @return {?}
 */
function isInside(outer, inner) {
    return (outer.left <= inner.left &&
        inner.left <= outer.right &&
        outer.left <= inner.right &&
        inner.right <= outer.right &&
        outer.top <= inner.top &&
        inner.top <= outer.bottom &&
        outer.top <= inner.bottom &&
        inner.bottom <= outer.bottom);
}
const trackByEventId = (index, event) => event.id ? event.id : event;
const trackByWeekDayHeaderDate = (index, day) => day.date.toISOString();
const trackByIndex = (index) => index;

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CalendarEventActionsComponent {
    constructor() {
        this.trackByIndex = trackByIndex;
    }
}
CalendarEventActionsComponent.decorators = [
    { type: Component, args: [{
                selector: 'mwl-calendar-event-actions',
                template: `
    <span *ngIf="event.actions" class="cal-event-actions">
      <a
        class="cal-event-action"
        href="javascript:;"
        *ngFor="let action of event.actions; trackBy:trackByIndex"
        (mwlClick)="action.onClick({event: event})"
        [ngClass]="action.cssClass"
        [innerHtml]="action.label">
      </a>
    </span>
  `
            },] },
];
/** @nocollapse */
CalendarEventActionsComponent.ctorParameters = () => [];
CalendarEventActionsComponent.propDecorators = {
    "event": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CalendarEventTitleComponent {
}
CalendarEventTitleComponent.decorators = [
    { type: Component, args: [{
                selector: 'mwl-calendar-event-title',
                template: `
    <ng-template
      #defaultTemplate
      let-event="event"
      let-view="view">
      <a
        class="cal-event-title"
        href="javascript:;"
        [innerHTML]="event.title | calendarEventTitle:view:event">
      </a>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        event: event,
        view: view
      }">
    </ng-template>
  `
            },] },
];
/** @nocollapse */
CalendarEventTitleComponent.ctorParameters = () => [];
CalendarEventTitleComponent.propDecorators = {
    "event": [{ type: Input },],
    "customTemplate": [{ type: Input },],
    "view": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CalendarTooltipWindowComponent {
}
CalendarTooltipWindowComponent.decorators = [
    { type: Component, args: [{
                template: `
    <ng-template
      #defaultTemplate
      let-contents="contents"
      let-placement="placement"
      let-event="event">
      <div class="cal-tooltip" [ngClass]="'cal-tooltip-' + placement">
        <div class="cal-tooltip-arrow"></div>
        <div class="cal-tooltip-inner" [innerHtml]="contents"></div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        contents: contents,
        placement: placement,
        event: event
      }">
    </ng-template>
  `
            },] },
];
/** @nocollapse */
CalendarTooltipWindowComponent.ctorParameters = () => [];
CalendarTooltipWindowComponent.propDecorators = {
    "contents": [{ type: Input },],
    "placement": [{ type: Input },],
    "event": [{ type: Input },],
    "customTemplate": [{ type: Input },],
};
class CalendarTooltipDirective {
    /**
     * @param {?} elementRef
     * @param {?} injector
     * @param {?} renderer
     * @param {?} componentFactoryResolver
     * @param {?} viewContainerRef
     * @param {?} document
     */
    constructor(elementRef, injector, renderer, componentFactoryResolver, viewContainerRef, document //tslint:disable-line
        //tslint:disable-line
    ) {
        this.elementRef = elementRef;
        this.injector = injector;
        this.renderer = renderer;
        this.viewContainerRef = viewContainerRef;
        this.document //tslint:disable-line
         = document;
        this.placement = 'top';
        this.positioning = new Positioning();
        this.tooltipFactory = componentFactoryResolver.resolveComponentFactory(CalendarTooltipWindowComponent);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.hide();
    }
    /**
     * @return {?}
     */
    onMouseOver() {
        this.show();
    }
    /**
     * @return {?}
     */
    onMouseOut() {
        this.hide();
    }
    /**
     * @return {?}
     */
    show() {
        if (!this.tooltipRef && this.contents) {
            this.tooltipRef = this.viewContainerRef.createComponent(this.tooltipFactory, 0, this.injector, []);
            this.tooltipRef.instance.contents = this.contents;
            this.tooltipRef.instance.placement = this.placement;
            this.tooltipRef.instance.customTemplate = this.customTemplate;
            this.tooltipRef.instance.event = this.event;
            if (this.appendToBody) {
                this.document.body.appendChild(this.tooltipRef.location.nativeElement);
            }
            requestAnimationFrame(() => {
                this.positionTooltip();
            });
        }
    }
    /**
     * @return {?}
     */
    hide() {
        if (this.tooltipRef) {
            this.viewContainerRef.remove(this.viewContainerRef.indexOf(this.tooltipRef.hostView));
            this.tooltipRef = null;
        }
    }
    /**
     * @return {?}
     */
    positionTooltip() {
        if (this.tooltipRef) {
            const /** @type {?} */ targetPosition = this.positioning.positionElements(this.elementRef.nativeElement, this.tooltipRef.location.nativeElement.children[0], this.placement, this.appendToBody);
            const /** @type {?} */ elm = this.tooltipRef.location.nativeElement
                .children[0];
            this.renderer.setStyle(elm, 'top', `${targetPosition.top}px`);
            this.renderer.setStyle(elm, 'left', `${targetPosition.left}px`);
        }
    }
}
CalendarTooltipDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mwlCalendarTooltip]'
            },] },
];
/** @nocollapse */
CalendarTooltipDirective.ctorParameters = () => [
    { type: ElementRef, },
    { type: Injector, },
    { type: Renderer2, },
    { type: ComponentFactoryResolver, },
    { type: ViewContainerRef, },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] },] },
];
CalendarTooltipDirective.propDecorators = {
    "contents": [{ type: Input, args: ['mwlCalendarTooltip',] },],
    "placement": [{ type: Input, args: ['tooltipPlacement',] },],
    "customTemplate": [{ type: Input, args: ['tooltipTemplate',] },],
    "event": [{ type: Input, args: ['tooltipEvent',] },],
    "appendToBody": [{ type: Input, args: ['tooltipAppendToBody',] },],
    "onMouseOver": [{ type: HostListener, args: ['mouseenter',] },],
    "onMouseOut": [{ type: HostListener, args: ['mouseleave',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Change the view date to the previous view. For example:
 *
 * ```typescript
 * <button
 *  mwlCalendarPreviousView
 *  [(viewDate)]="viewDate"
 *  [view]="view">
 *  Previous
 * </button>
 * ```
 */
class CalendarPreviousViewDirective {
    constructor() {
        /**
         * Called when the view date is changed
         */
        this.viewDateChange = new EventEmitter();
    }
    /**
     * @hidden
     * @return {?}
     */
    onClick() {
        const /** @type {?} */ subFn = {
            day: subDays,
            week: subWeeks,
            month: subMonths
        }[this.view];
        this.viewDateChange.emit(subFn(this.viewDate, 1));
    }
}
CalendarPreviousViewDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mwlCalendarPreviousView]'
            },] },
];
/** @nocollapse */
CalendarPreviousViewDirective.ctorParameters = () => [];
CalendarPreviousViewDirective.propDecorators = {
    "view": [{ type: Input },],
    "viewDate": [{ type: Input },],
    "viewDateChange": [{ type: Output },],
    "onClick": [{ type: HostListener, args: ['click',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Change the view date to the next view. For example:
 *
 * ```typescript
 * <button
 *  mwlCalendarNextView
 *  [(viewDate)]="viewDate"
 *  [view]="view">
 *  Next
 * </button>
 * ```
 */
class CalendarNextViewDirective {
    constructor() {
        /**
         * Called when the view date is changed
         */
        this.viewDateChange = new EventEmitter();
    }
    /**
     * @hidden
     * @return {?}
     */
    onClick() {
        const /** @type {?} */ addFn = {
            day: addDays,
            week: addWeeks,
            month: addMonths
        }[this.view];
        this.viewDateChange.emit(addFn(this.viewDate, 1));
    }
}
CalendarNextViewDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mwlCalendarNextView]'
            },] },
];
/** @nocollapse */
CalendarNextViewDirective.ctorParameters = () => [];
CalendarNextViewDirective.propDecorators = {
    "view": [{ type: Input },],
    "viewDate": [{ type: Input },],
    "viewDateChange": [{ type: Output },],
    "onClick": [{ type: HostListener, args: ['click',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Change the view date to the current day. For example:
 *
 * ```typescript
 * <button
 *  mwlCalendarToday
 *  [(viewDate)]="viewDate">
 *  Today
 * </button>
 * ```
 */
class CalendarTodayDirective {
    constructor() {
        /**
         * Called when the view date is changed
         */
        this.viewDateChange = new EventEmitter();
    }
    /**
     * @hidden
     * @return {?}
     */
    onClick() {
        this.viewDateChange.emit(startOfToday());
    }
}
CalendarTodayDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mwlCalendarToday]'
            },] },
];
/** @nocollapse */
CalendarTodayDirective.ctorParameters = () => [];
CalendarTodayDirective.propDecorators = {
    "viewDate": [{ type: Input },],
    "viewDateChange": [{ type: Output },],
    "onClick": [{ type: HostListener, args: ['click',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * This will use the angular date pipe to do all date formatting. It is the default date formatter used by the calendar.
 */
class CalendarAngularDateFormatter {
    /**
     * The month view header week day labels
     * @param {?} __0
     * @return {?}
     */
    monthViewColumnHeader({ date, locale }) {
        return new DatePipe(locale).transform(date, 'EEEE', locale);
    }
    /**
     * The month view cell day number
     * @param {?} __0
     * @return {?}
     */
    monthViewDayNumber({ date, locale }) {
        return new DatePipe(locale).transform(date, 'd', locale);
    }
    /**
     * The month view title
     * @param {?} __0
     * @return {?}
     */
    monthViewTitle({ date, locale }) {
        return new DatePipe(locale).transform(date, 'MMMM y', locale);
    }
    /**
     * The week view header week day labels
     * @param {?} __0
     * @return {?}
     */
    weekViewColumnHeader({ date, locale }) {
        return new DatePipe(locale).transform(date, 'EEEE', locale);
    }
    /**
     * The week view sub header day and month labels
     * @param {?} __0
     * @return {?}
     */
    weekViewColumnSubHeader({ date, locale }) {
        return new DatePipe(locale).transform(date, 'MMM d', locale);
    }
    /**
     * The week view title
     * @param {?} __0
     * @return {?}
     */
    weekViewTitle({ date, locale }) {
        const /** @type {?} */ year = new DatePipe(locale).transform(date, 'y', locale);
        const /** @type {?} */ weekNumber = getISOWeek(date);
        return `Week ${weekNumber} of ${year}`;
    }
    /**
     * The time formatting down the left hand side of the day view
     * @param {?} __0
     * @return {?}
     */
    dayViewHour({ date, locale }) {
        return new DatePipe(locale).transform(date, 'h a', locale);
    }
    /**
     * The day view title
     * @param {?} __0
     * @return {?}
     */
    dayViewTitle({ date, locale }) {
        return new DatePipe(locale).transform(date, 'EEEE, MMMM d, y', locale);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * This class is responsible for all formatting of dates. There are 3 implementations available, the `CalendarAngularDateFormatter` (default) which uses the angular date pipe to format dates, the `CalendarNativeDateFormatter` which will use the <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl" target="_blank">Intl</a> API to format dates, or there is the `CalendarMomentDateFormatter` which uses <a href="http://momentjs.com/" target="_blank">moment</a>.
 *
 * If you wish, you may override any of the defaults via angulars DI. For example:
 *
 * ```typescript
 * import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
 * import { DatePipe } from '\@angular/common';
 *
 * class CustomDateFormatter extends CalendarDateFormatter {
 *
 *   public monthViewColumnHeader({date, locale}: DateFormatterParams): string {
 *     return new DatePipe(locale).transform(date, 'EEE', locale); // use short week days
 *   }
 *
 * }
 *
 * // in your component that uses the calendar
 * providers: [{
 *   provide: CalendarDateFormatter,
 *   useClass: CustomDateFormatter
 * }]
 * ```
 */
class CalendarDateFormatter extends CalendarAngularDateFormatter {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * This pipe is primarily for rendering the current view title. Example usage:
 * ```typescript
 * // where `viewDate` is a `Date` and view is `'month' | 'week' | 'day'`
 * {{ viewDate | calendarDate:(view + 'ViewTitle'):'en' }}
 * ```
 */
class CalendarDatePipe {
    /**
     * @param {?} dateFormatter
     * @param {?} locale
     */
    constructor(dateFormatter, locale) {
        this.dateFormatter = dateFormatter;
        this.locale = locale;
    }
    /**
     * @param {?} date
     * @param {?} method
     * @param {?=} locale
     * @return {?}
     */
    transform(date, method, locale = this.locale) {
        return this.dateFormatter[method]({ date, locale });
    }
}
CalendarDatePipe.decorators = [
    { type: Pipe, args: [{
                name: 'calendarDate'
            },] },
];
/** @nocollapse */
CalendarDatePipe.ctorParameters = () => [
    { type: CalendarDateFormatter, },
    { type: undefined, decorators: [{ type: Inject, args: [LOCALE_ID,] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * This class is responsible for displaying all event titles within the calendar. You may override any of its methods via angulars DI to suit your requirements. For example:
 *
 * ```typescript
 * import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
 *
 * class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
 *
 *   month(event: CalendarEvent): string {
 *     return `Custom prefix: ${event.title}`;
 *   }
 *
 * }
 *
 * // in your component
 * providers: [{
 *  provide: CalendarEventTitleFormatter,
 *  useClass: CustomEventTitleFormatter
 * }]
 * ```
 */
class CalendarEventTitleFormatter {
    /**
     * The month view event title.
     * @param {?} event
     * @return {?}
     */
    month(event) {
        return event.title;
    }
    /**
     * The month view event tooltip. Return a falsey value from this to disable the tooltip.
     * @param {?} event
     * @return {?}
     */
    monthTooltip(event) {
        return event.title;
    }
    /**
     * The week view event title.
     * @param {?} event
     * @return {?}
     */
    week(event) {
        return event.title;
    }
    /**
     * The week view event tooltip. Return a falsey value from this to disable the tooltip.
     * @param {?} event
     * @return {?}
     */
    weekTooltip(event) {
        return event.title;
    }
    /**
     * The day view event title.
     * @param {?} event
     * @return {?}
     */
    day(event) {
        return event.title;
    }
    /**
     * The day view event tooltip. Return a falsey value from this to disable the tooltip.
     * @param {?} event
     * @return {?}
     */
    dayTooltip(event) {
        return event.title;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CalendarEventTitlePipe {
    /**
     * @param {?} calendarEventTitle
     */
    constructor(calendarEventTitle) {
        this.calendarEventTitle = calendarEventTitle;
    }
    /**
     * @param {?} title
     * @param {?} titleType
     * @param {?} event
     * @return {?}
     */
    transform(title, titleType, event) {
        return this.calendarEventTitle[titleType](event);
    }
}
CalendarEventTitlePipe.decorators = [
    { type: Pipe, args: [{
                name: 'calendarEventTitle'
            },] },
];
/** @nocollapse */
CalendarEventTitlePipe.ctorParameters = () => [
    { type: CalendarEventTitleFormatter, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class ClickDirective {
    /**
     * @param {?} renderer
     * @param {?} elm
     */
    constructor(renderer, elm) {
        this.renderer = renderer;
        this.elm = elm;
        this.click = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        const /** @type {?} */ eventName = typeof window !== 'undefined' && typeof window['Hammer'] !== 'undefined'
            ? 'tap'
            : 'click';
        this.removeListener = this.renderer.listen(this.elm.nativeElement, eventName, event => {
            this.click.next(event);
        });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.removeListener();
    }
}
ClickDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mwlClick]'
            },] },
];
/** @nocollapse */
ClickDirective.ctorParameters = () => [
    { type: Renderer2, },
    { type: ElementRef, },
];
ClickDirective.propDecorators = {
    "click": [{ type: Output, args: ['mwlClick',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CalendarUtils {
    /**
     * @param {?} args
     * @return {?}
     */
    getMonthView(args) {
        return getMonthView(args);
    }
    /**
     * @param {?} args
     * @return {?}
     */
    getWeekViewHeader(args) {
        return getWeekViewHeader(args);
    }
    /**
     * @param {?} args
     * @return {?}
     */
    getWeekView(args) {
        return getWeekView(args);
    }
    /**
     * @param {?} args
     * @return {?}
     */
    getDayView(args) {
        return getDayView(args);
    }
    /**
     * @param {?} args
     * @return {?}
     */
    getDayViewHourGrid(args) {
        return getDayViewHourGrid(args);
    }
}
CalendarUtils.decorators = [
    { type: Injectable },
];
/** @nocollapse */
CalendarUtils.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const MOMENT = new InjectionToken('Moment');
/**
 * This will use <a href="http://momentjs.com/" target="_blank">moment</a> to do all date formatting. To use this class:
 *
 * ```typescript
 * import { CalendarDateFormatter, CalendarMomentDateFormatter, MOMENT } from 'angular-calendar';
 * import moment from 'moment';
 *
 * // in your component
 * provide: [{
 *   provide: MOMENT, useValue: moment
 * }, {
 *   provide: CalendarDateFormatter, useClass: CalendarMomentDateFormatter
 * }]
 *
 * ```
 */
class CalendarMomentDateFormatter {
    /**
     * @hidden
     * @param {?} moment
     */
    constructor(moment) {
        this.moment = moment;
    }
    /**
     * The month view header week day labels
     * @param {?} __0
     * @return {?}
     */
    monthViewColumnHeader({ date, locale }) {
        return this.moment(date)
            .locale(locale)
            .format('dddd');
    }
    /**
     * The month view cell day number
     * @param {?} __0
     * @return {?}
     */
    monthViewDayNumber({ date, locale }) {
        return this.moment(date)
            .locale(locale)
            .format('D');
    }
    /**
     * The month view title
     * @param {?} __0
     * @return {?}
     */
    monthViewTitle({ date, locale }) {
        return this.moment(date)
            .locale(locale)
            .format('MMMM YYYY');
    }
    /**
     * The week view header week day labels
     * @param {?} __0
     * @return {?}
     */
    weekViewColumnHeader({ date, locale }) {
        return this.moment(date)
            .locale(locale)
            .format('dddd');
    }
    /**
     * The week view sub header day and month labels
     * @param {?} __0
     * @return {?}
     */
    weekViewColumnSubHeader({ date, locale }) {
        return this.moment(date)
            .locale(locale)
            .format('D MMM');
    }
    /**
     * The week view title
     * @param {?} __0
     * @return {?}
     */
    weekViewTitle({ date, locale }) {
        return this.moment(date)
            .locale(locale)
            .format('[Week] W [of] YYYY');
    }
    /**
     * The time formatting down the left hand side of the day view
     * @param {?} __0
     * @return {?}
     */
    dayViewHour({ date, locale }) {
        return this.moment(date)
            .locale(locale)
            .format('ha');
    }
    /**
     * The day view title
     * @param {?} __0
     * @return {?}
     */
    dayViewTitle({ date, locale }) {
        return this.moment(date)
            .locale(locale)
            .format('dddd, D MMMM, YYYY');
    }
}
/** @nocollapse */
CalendarMomentDateFormatter.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [MOMENT,] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * This will use <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl" target="_blank">Intl</a> API to do all date formatting.
 *
 * You will need to include a <a href="https://github.com/andyearnshaw/Intl.js/">polyfill</a> for older browsers.
 */
class CalendarNativeDateFormatter {
    /**
     * The month view header week day labels
     * @param {?} __0
     * @return {?}
     */
    monthViewColumnHeader({ date, locale }) {
        return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
    }
    /**
     * The month view cell day number
     * @param {?} __0
     * @return {?}
     */
    monthViewDayNumber({ date, locale }) {
        return new Intl.DateTimeFormat(locale, { day: 'numeric' }).format(date);
    }
    /**
     * The month view title
     * @param {?} __0
     * @return {?}
     */
    monthViewTitle({ date, locale }) {
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long'
        }).format(date);
    }
    /**
     * The week view header week day labels
     * @param {?} __0
     * @return {?}
     */
    weekViewColumnHeader({ date, locale }) {
        return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
    }
    /**
     * The week view sub header day and month labels
     * @param {?} __0
     * @return {?}
     */
    weekViewColumnSubHeader({ date, locale }) {
        return new Intl.DateTimeFormat(locale, {
            day: 'numeric',
            month: 'short'
        }).format(date);
    }
    /**
     * The week view title
     * @param {?} __0
     * @return {?}
     */
    weekViewTitle({ date, locale }) {
        const /** @type {?} */ year = new Intl.DateTimeFormat(locale, {
            year: 'numeric'
        }).format(date);
        const /** @type {?} */ weekNumber = getISOWeek(date);
        return `Week ${weekNumber} of ${year}`;
    }
    /**
     * The time formatting down the left hand side of the day view
     * @param {?} __0
     * @return {?}
     */
    dayViewHour({ date, locale }) {
        return new Intl.DateTimeFormat(locale, { hour: 'numeric' }).format(date);
    }
    /**
     * The day view title
     * @param {?} __0
     * @return {?}
     */
    dayViewTitle({ date, locale }) {
        return new Intl.DateTimeFormat(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long'
        }).format(date);
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
 * Import this module to if you're just using a singular view and want to save on bundle size. Example usage:
 *
 * ```typescript
 * import { CalendarCommonModule } from 'angular-calendar/modules/common';
 * import { CalendarMonthModule } from 'angular-calendar/modules/month';
 *
 * \@NgModule({
 *   imports: [
 *     CalendarCommonModule.forRoot(),
 *     CalendarMonthModule
 *   ]
 * })
 * class MyModule {}
 * ```
 *
 */
class CalendarCommonModule {
    /**
     * @param {?=} config
     * @return {?}
     */
    static forRoot(config = {}) {
        return {
            ngModule: CalendarCommonModule,
            providers: [
                DraggableHelper,
                config.eventTitleFormatter || CalendarEventTitleFormatter,
                config.dateFormatter || CalendarDateFormatter,
                config.utils || CalendarUtils
            ]
        };
    }
}
CalendarCommonModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    CalendarEventActionsComponent,
                    CalendarEventTitleComponent,
                    CalendarTooltipWindowComponent,
                    CalendarTooltipDirective,
                    CalendarPreviousViewDirective,
                    CalendarNextViewDirective,
                    CalendarTodayDirective,
                    CalendarDatePipe,
                    CalendarEventTitlePipe,
                    ClickDirective
                ],
                imports: [CommonModule],
                exports: [
                    CalendarEventActionsComponent,
                    CalendarEventTitleComponent,
                    CalendarTooltipWindowComponent,
                    CalendarTooltipDirective,
                    CalendarPreviousViewDirective,
                    CalendarNextViewDirective,
                    CalendarTodayDirective,
                    CalendarDatePipe,
                    CalendarEventTitlePipe,
                    ClickDirective
                ],
                entryComponents: [CalendarTooltipWindowComponent]
            },] },
];
/** @nocollapse */
CalendarCommonModule.ctorParameters = () => [];

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
 * Shows all events on a given month. Example usage:
 *
 * ```typescript
 * <mwl-calendar-month-view
 *  [viewDate]="viewDate"
 *  [events]="events">
 * </mwl-calendar-month-view>
 * ```
 */
class CalendarMonthViewComponent {
    /**
     * @hidden
     * @param {?} cdr
     * @param {?} utils
     * @param {?} locale
     */
    constructor(cdr, utils, locale) {
        this.cdr = cdr;
        this.utils = utils;
        /**
         * An array of events to display on view.
         * The schema is available here: https://github.com/mattlewis92/calendar-utils/blob/c51689985f59a271940e30bc4e2c4e1fee3fcb5c/src/calendarUtils.ts#L49-L63
         */
        this.events = [];
        /**
         * An array of day indexes (0 = sunday, 1 = monday etc) that will be hidden on the view
         */
        this.excludeDays = [];
        /**
         * Whether the events list for the day of the `viewDate` option is visible or not
         */
        this.activeDayIsOpen = false;
        /**
         * The placement of the event tooltip
         */
        this.tooltipPlacement = 'top';
        /**
         * Whether to append tooltips to the body or next to the trigger element
         */
        this.tooltipAppendToBody = true;
        /**
         * An output that will be called before the view is rendered for the current month.
         * If you add the `cssClass` property to a day in the body it will add that class to the cell element in the template
         */
        this.beforeViewRender = new EventEmitter();
        /**
         * Called when the day cell is clicked
         */
        this.dayClicked = new EventEmitter();
        /**
         * Called when the event title is clicked
         */
        this.eventClicked = new EventEmitter();
        /**
         * Called when an event is dragged and dropped
         */
        this.eventTimesChanged = new EventEmitter();
        /**
         * @hidden
         */
        this.trackByIndex = trackByIndex;
        /**
         * @hidden
         */
        this.trackByDate = (index, day) => day.date.toISOString();
        this.locale = locale;
    }
    /**
     * @hidden
     * @return {?}
     */
    ngOnInit() {
        if (this.refresh) {
            this.refreshSubscription = this.refresh.subscribe(() => {
                this.refreshAll();
                this.cdr.markForCheck();
            });
        }
    }
    /**
     * @hidden
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes.viewDate || changes.excludeDays || changes.weekendDays) {
            this.refreshHeader();
        }
        if (changes.events) {
            validateEvents$1(this.events);
        }
        if (changes.viewDate ||
            changes.events ||
            changes.excludeDays ||
            changes.weekendDays) {
            this.refreshBody();
        }
        if (changes.activeDayIsOpen ||
            changes.viewDate ||
            changes.events ||
            changes.excludeDays) {
            this.checkActiveDayIsOpen();
        }
    }
    /**
     * @hidden
     * @return {?}
     */
    ngOnDestroy() {
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }
    /**
     * @hidden
     * @param {?} event
     * @param {?} isHighlighted
     * @return {?}
     */
    toggleDayHighlight(event, isHighlighted) {
        this.view.days.forEach(day => {
            if (isHighlighted && day.events.indexOf(event) > -1) {
                day.backgroundColor = event.color.secondary;
            }
            else {
                delete day.backgroundColor;
            }
        });
    }
    /**
     * @hidden
     * @param {?} day
     * @param {?} event
     * @return {?}
     */
    eventDropped(day, event) {
        const /** @type {?} */ year = getYear(day.date);
        const /** @type {?} */ month = getMonth(day.date);
        const /** @type {?} */ date = getDate(day.date);
        const /** @type {?} */ newStart = setDate(setMonth(setYear(event.start, year), month), date);
        let /** @type {?} */ newEnd;
        if (event.end) {
            const /** @type {?} */ secondsDiff = differenceInSeconds(newStart, event.start);
            newEnd = addSeconds(event.end, secondsDiff);
        }
        this.eventTimesChanged.emit({ event, newStart, newEnd, day });
    }
    /**
     * @hidden
     * @param {?} clickEvent
     * @param {?} day
     * @return {?}
     */
    handleDayClick(clickEvent, day) {
        // when using hammerjs, stopPropagation doesn't work. See https://github.com/mattlewis92/angular-calendar/issues/318
        if (!clickEvent.target.classList.contains('cal-event')) {
            this.dayClicked.emit({ day });
        }
    }
    /**
     * @return {?}
     */
    refreshHeader() {
        this.columnHeaders = this.utils.getWeekViewHeader({
            viewDate: this.viewDate,
            weekStartsOn: this.weekStartsOn,
            excluded: this.excludeDays,
            weekendDays: this.weekendDays
        });
        this.emitBeforeViewRender();
    }
    /**
     * @return {?}
     */
    refreshBody() {
        this.view = this.utils.getMonthView({
            events: this.events,
            viewDate: this.viewDate,
            weekStartsOn: this.weekStartsOn,
            excluded: this.excludeDays,
            weekendDays: this.weekendDays
        });
        this.emitBeforeViewRender();
    }
    /**
     * @return {?}
     */
    checkActiveDayIsOpen() {
        if (this.activeDayIsOpen === true) {
            this.openDay = this.view.days.find(day => isSameDay(day.date, this.viewDate));
            const /** @type {?} */ index = this.view.days.indexOf(this.openDay);
            this.openRowIndex =
                Math.floor(index / this.view.totalDaysVisibleInWeek) *
                    this.view.totalDaysVisibleInWeek;
        }
        else {
            this.openRowIndex = null;
            this.openDay = null;
        }
    }
    /**
     * @return {?}
     */
    refreshAll() {
        this.columnHeaders = null;
        this.view = null;
        this.refreshHeader();
        this.refreshBody();
        this.checkActiveDayIsOpen();
    }
    /**
     * @return {?}
     */
    emitBeforeViewRender() {
        if (this.columnHeaders && this.view) {
            this.beforeViewRender.emit({
                header: this.columnHeaders,
                body: this.view.days,
                period: this.view.period
            });
        }
    }
}
CalendarMonthViewComponent.decorators = [
    { type: Component, args: [{
                selector: 'mwl-calendar-month-view',
                template: `
    <div class="cal-month-view">
      <mwl-calendar-month-view-header
        [days]="columnHeaders"
        [locale]="locale"
        [customTemplate]="headerTemplate">
      </mwl-calendar-month-view-header>
      <div class="cal-days">
        <div *ngFor="let rowIndex of view.rowOffsets; trackByIndex">
          <div class="cal-cell-row">
            <mwl-calendar-month-cell
              *ngFor="let day of (view.days | slice : rowIndex : rowIndex + (view.totalDaysVisibleInWeek)); trackBy:trackByDate"
              [class.cal-drag-over]="day.dragOver"
              [ngClass]="day?.cssClass"
              [day]="day"
              [openDay]="openDay"
              [locale]="locale"
              [tooltipPlacement]="tooltipPlacement"
              [tooltipAppendToBody]="tooltipAppendToBody"
              [tooltipTemplate]="tooltipTemplate"
              [customTemplate]="cellTemplate"
              (click)="handleDayClick($event, day)"
              (highlightDay)="toggleDayHighlight($event.event, true)"
              (unhighlightDay)="toggleDayHighlight($event.event, false)"
              mwlDroppable
              (dragEnter)="day.dragOver = true"
              (dragLeave)="day.dragOver = false"
              (drop)="day.dragOver = false; eventDropped(day, $event.dropData.event)"
              (eventClicked)="eventClicked.emit({event: $event.event})">
            </mwl-calendar-month-cell>
          </div>
          <mwl-calendar-open-day-events
            [isOpen]="openRowIndex === rowIndex"
            [events]="openDay?.events"
            [customTemplate]="openDayEventsTemplate"
            [eventTitleTemplate]="eventTitleTemplate"
            (eventClicked)="eventClicked.emit({event: $event.event})">
          </mwl-calendar-open-day-events>
        </div>
      </div>
    </div>
  `
            },] },
];
/** @nocollapse */
CalendarMonthViewComponent.ctorParameters = () => [
    { type: ChangeDetectorRef, },
    { type: CalendarUtils, },
    { type: undefined, decorators: [{ type: Inject, args: [LOCALE_ID,] },] },
];
CalendarMonthViewComponent.propDecorators = {
    "viewDate": [{ type: Input },],
    "events": [{ type: Input },],
    "excludeDays": [{ type: Input },],
    "activeDayIsOpen": [{ type: Input },],
    "refresh": [{ type: Input },],
    "locale": [{ type: Input },],
    "tooltipPlacement": [{ type: Input },],
    "tooltipTemplate": [{ type: Input },],
    "tooltipAppendToBody": [{ type: Input },],
    "weekStartsOn": [{ type: Input },],
    "headerTemplate": [{ type: Input },],
    "cellTemplate": [{ type: Input },],
    "openDayEventsTemplate": [{ type: Input },],
    "eventTitleTemplate": [{ type: Input },],
    "weekendDays": [{ type: Input },],
    "beforeViewRender": [{ type: Output },],
    "dayClicked": [{ type: Output },],
    "eventClicked": [{ type: Output },],
    "eventTimesChanged": [{ type: Output },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CalendarMonthViewHeaderComponent {
    constructor() {
        this.trackByWeekDayHeaderDate = trackByWeekDayHeaderDate;
    }
}
CalendarMonthViewHeaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'mwl-calendar-month-view-header',
                template: `
    <ng-template
      #defaultTemplate
      let-days="days"
      let-locale="locale">
      <div class="cal-cell-row cal-header">
        <div
          class="cal-cell"
          *ngFor="let day of days; trackBy:trackByWeekDayHeaderDate"
          [class.cal-past]="day.isPast"
          [class.cal-today]="day.isToday"
          [class.cal-future]="day.isFuture"
          [class.cal-weekend]="day.isWeekend"
          [ngClass]="day.cssClass">
          {{ day.date | calendarDate:'monthViewColumnHeader':locale }}
        </div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{days: days, locale: locale}">
    </ng-template>
  `
            },] },
];
/** @nocollapse */
CalendarMonthViewHeaderComponent.ctorParameters = () => [];
CalendarMonthViewHeaderComponent.propDecorators = {
    "days": [{ type: Input },],
    "locale": [{ type: Input },],
    "customTemplate": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CalendarMonthCellComponent {
    constructor() {
        this.highlightDay = new EventEmitter();
        this.unhighlightDay = new EventEmitter();
        this.eventClicked = new EventEmitter();
        this.trackByEventId = trackByEventId;
    }
}
CalendarMonthCellComponent.decorators = [
    { type: Component, args: [{
                selector: 'mwl-calendar-month-cell',
                template: `
    <ng-template
      #defaultTemplate
      let-day="day"
      let-openDay="openDay"
      let-locale="locale"
      let-tooltipPlacement="tooltipPlacement"
      let-highlightDay="highlightDay"
      let-unhighlightDay="unhighlightDay"
      let-eventClicked="eventClicked"
      let-tooltipTemplate="tooltipTemplate"
      let-tooltipAppendToBody="tooltipAppendToBody">
      <div class="cal-cell-top">
        <span class="cal-day-badge" *ngIf="day.badgeTotal > 0">{{ day.badgeTotal }}</span>
        <span class="cal-day-number">{{ day.date | calendarDate:'monthViewDayNumber':locale }}</span>
      </div>
      <div class="cal-events" *ngIf="day.events.length > 0">
        <div
          class="cal-event"
          *ngFor="let event of day.events; trackBy:trackByEventId"
          [style.backgroundColor]="event.color.primary"
          [ngClass]="event?.cssClass"
          (mouseenter)="highlightDay.emit({event: event})"
          (mouseleave)="unhighlightDay.emit({event: event})"
          [mwlCalendarTooltip]="event.title | calendarEventTitle:'monthTooltip':event"
          [tooltipPlacement]="tooltipPlacement"
          [tooltipEvent]="event"
          [tooltipTemplate]="tooltipTemplate"
          [tooltipAppendToBody]="tooltipAppendToBody"
          mwlDraggable
          [dropData]="{event: event}"
          [dragAxis]="{x: event.draggable, y: event.draggable}"
          (mwlClick)="eventClicked.emit({ event: event })">
        </div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        day: day,
        openDay: openDay,
        locale: locale,
        tooltipPlacement: tooltipPlacement,
        highlightDay: highlightDay,
        unhighlightDay: unhighlightDay,
        eventClicked: eventClicked,
        tooltipTemplate: tooltipTemplate,
        tooltipAppendToBody: tooltipAppendToBody
      }">
    </ng-template>
  `,
                host: {
                    class: 'cal-cell cal-day-cell',
                    '[class.cal-past]': 'day.isPast',
                    '[class.cal-today]': 'day.isToday',
                    '[class.cal-future]': 'day.isFuture',
                    '[class.cal-weekend]': 'day.isWeekend',
                    '[class.cal-in-month]': 'day.inMonth',
                    '[class.cal-out-month]': '!day.inMonth',
                    '[class.cal-has-events]': 'day.events.length > 0',
                    '[class.cal-open]': 'day === openDay',
                    '[style.backgroundColor]': 'day.backgroundColor'
                }
            },] },
];
/** @nocollapse */
CalendarMonthCellComponent.ctorParameters = () => [];
CalendarMonthCellComponent.propDecorators = {
    "day": [{ type: Input },],
    "openDay": [{ type: Input },],
    "locale": [{ type: Input },],
    "tooltipPlacement": [{ type: Input },],
    "tooltipAppendToBody": [{ type: Input },],
    "customTemplate": [{ type: Input },],
    "tooltipTemplate": [{ type: Input },],
    "highlightDay": [{ type: Output },],
    "unhighlightDay": [{ type: Output },],
    "eventClicked": [{ type: Output },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CalendarOpenDayEventsComponent {
    constructor() {
        this.isOpen = false;
        this.eventClicked = new EventEmitter();
        this.trackByEventId = trackByEventId;
    }
}
CalendarOpenDayEventsComponent.decorators = [
    { type: Component, args: [{
                selector: 'mwl-calendar-open-day-events',
                template: `
    <ng-template
      #defaultTemplate
      let-events="events"
      let-eventClicked="eventClicked">
      <div
        *ngFor="let event of events; trackBy:trackByEventId"
        [ngClass]="event?.cssClass"
        mwlDraggable
        [dropData]="{event: event}"
        [dragAxis]="{x: event.draggable, y: event.draggable}">
        <span
          class="cal-event"
          [style.backgroundColor]="event.color.primary">
        </span>
        <mwl-calendar-event-title
          [event]="event"
          [customTemplate]="eventTitleTemplate"
          view="month"
          (mwlClick)="eventClicked.emit({event: event})">
        </mwl-calendar-event-title>
        <mwl-calendar-event-actions [event]="event"></mwl-calendar-event-actions>
      </div>
    </ng-template>
    <div class="cal-open-day-events" [@collapse] *ngIf="isOpen">
      <ng-template
        [ngTemplateOutlet]="customTemplate || defaultTemplate"
        [ngTemplateOutletContext]="{
          events: events,
          eventClicked: eventClicked
        }">
      </ng-template>
    </div>
  `,
                animations: [
                    trigger('collapse', [
                        transition('void => *', [
                            style({ height: 0, overflow: 'hidden' }),
                            animate('150ms', style({ height: '*' }))
                        ]),
                        transition('* => void', [
                            style({ height: '*', overflow: 'hidden' }),
                            animate('150ms', style({ height: 0 }))
                        ])
                    ])
                ]
            },] },
];
/** @nocollapse */
CalendarOpenDayEventsComponent.ctorParameters = () => [];
CalendarOpenDayEventsComponent.propDecorators = {
    "isOpen": [{ type: Input },],
    "events": [{ type: Input },],
    "customTemplate": [{ type: Input },],
    "eventTitleTemplate": [{ type: Input },],
    "eventClicked": [{ type: Output },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CalendarMonthModule {
}
CalendarMonthModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule, DragAndDropModule, CalendarCommonModule],
                declarations: [
                    CalendarMonthViewComponent,
                    CalendarMonthCellComponent,
                    CalendarOpenDayEventsComponent,
                    CalendarMonthViewHeaderComponent
                ],
                exports: [
                    DragAndDropModule,
                    CalendarMonthViewComponent,
                    CalendarMonthCellComponent,
                    CalendarOpenDayEventsComponent,
                    CalendarMonthViewHeaderComponent
                ]
            },] },
];
/** @nocollapse */
CalendarMonthModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CalendarDragHelper {
    /**
     * @param {?} dragContainerElement
     * @param {?} draggableElement
     */
    constructor(dragContainerElement, draggableElement) {
        this.dragContainerElement = dragContainerElement;
        this.startPosition = draggableElement.getBoundingClientRect();
    }
    /**
     * @param {?} __0
     * @return {?}
     */
    validateDrag({ x, y }) {
        const /** @type {?} */ newRect = Object.assign({}, this.startPosition, {
            left: this.startPosition.left + x,
            right: this.startPosition.right + x,
            top: this.startPosition.top + y,
            bottom: this.startPosition.bottom + y
        });
        return isInside(this.dragContainerElement.getBoundingClientRect(), newRect);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CalendarResizeHelper {
    /**
     * @param {?} resizeContainerElement
     * @param {?=} minWidth
     */
    constructor(resizeContainerElement, minWidth) {
        this.resizeContainerElement = resizeContainerElement;
        this.minWidth = minWidth;
    }
    /**
     * @param {?} __0
     * @return {?}
     */
    validateResize({ rectangle }) {
        if (this.minWidth && rectangle.width < this.minWidth) {
            return false;
        }
        return isInside(this.resizeContainerElement.getBoundingClientRect(), rectangle);
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
 * Shows all events on a given week. Example usage:
 *
 * ```typescript
 * <mwl-calendar-week-view
 *  [viewDate]="viewDate"
 *  [events]="events">
 * </mwl-calendar-week-view>
 * ```
 */
class CalendarWeekViewComponent {
    /**
     * @hidden
     * @param {?} cdr
     * @param {?} utils
     * @param {?} locale
     */
    constructor(cdr, utils, locale) {
        this.cdr = cdr;
        this.utils = utils;
        /**
         * An array of events to display on view
         * The schema is available here: https://github.com/mattlewis92/calendar-utils/blob/c51689985f59a271940e30bc4e2c4e1fee3fcb5c/src/calendarUtils.ts#L49-L63
         */
        this.events = [];
        /**
         * An array of day indexes (0 = sunday, 1 = monday etc) that will be hidden on the view
         */
        this.excludeDays = [];
        /**
         * The placement of the event tooltip
         */
        this.tooltipPlacement = 'bottom';
        /**
         * Whether to append tooltips to the body or next to the trigger element
         */
        this.tooltipAppendToBody = true;
        /**
         * The precision to display events.
         * `days` will round event start and end dates to the nearest day and `minutes` will not do this rounding
         */
        this.precision = 'days';
        /**
         * Called when a header week day is clicked. Adding a `cssClass` property on `$event.day` will add that class to the header element
         */
        this.dayHeaderClicked = new EventEmitter();
        /**
         * Called when the event title is clicked
         */
        this.eventClicked = new EventEmitter();
        /**
         * Called when an event is resized or dragged and dropped
         */
        this.eventTimesChanged = new EventEmitter();
        /**
         * An output that will be called before the view is rendered for the current week.
         * If you add the `cssClass` property to a day in the header it will add that class to the cell element in the template
         */
        this.beforeViewRender = new EventEmitter();
        /**
         * @hidden
         */
        this.currentResizes = new Map();
        /**
         * @hidden
         */
        this.trackByIndex = trackByIndex;
        /**
         * @hidden
         */
        this.trackByEventId = (index, weekEvent) => weekEvent.event.id ? weekEvent.event.id : weekEvent;
        this.locale = locale;
    }
    /**
     * @hidden
     * @return {?}
     */
    ngOnInit() {
        if (this.refresh) {
            this.refreshSubscription = this.refresh.subscribe(() => {
                this.refreshAll();
                this.cdr.markForCheck();
            });
        }
    }
    /**
     * @hidden
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes.viewDate || changes.excludeDays || changes.weekendDays) {
            this.refreshHeader();
        }
        if (changes.events) {
            validateEvents$1(this.events);
        }
        if (changes.events || changes.viewDate || changes.excludeDays) {
            this.refreshBody();
        }
    }
    /**
     * @hidden
     * @return {?}
     */
    ngOnDestroy() {
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }
    /**
     * @hidden
     * @param {?} weekViewContainer
     * @param {?} weekEvent
     * @param {?} resizeEvent
     * @return {?}
     */
    resizeStarted(weekViewContainer, weekEvent, resizeEvent) {
        this.currentResizes.set(weekEvent, {
            originalOffset: weekEvent.offset,
            originalSpan: weekEvent.span,
            edge: typeof resizeEvent.edges.left !== 'undefined' ? 'left' : 'right'
        });
        this.dayColumnWidth = this.getDayColumnWidth(weekViewContainer);
        const /** @type {?} */ resizeHelper = new CalendarResizeHelper(weekViewContainer, this.dayColumnWidth);
        this.validateResize = ({ rectangle }) => resizeHelper.validateResize({ rectangle });
        this.cdr.markForCheck();
    }
    /**
     * @hidden
     * @param {?} weekEvent
     * @param {?} resizeEvent
     * @param {?} dayWidth
     * @return {?}
     */
    resizing(weekEvent, resizeEvent, dayWidth) {
        const /** @type {?} */ currentResize = this.currentResizes.get(weekEvent);
        if (resizeEvent.edges.left) {
            const /** @type {?} */ diff = Math.round(+resizeEvent.edges.left / dayWidth);
            weekEvent.offset = currentResize.originalOffset + diff;
            weekEvent.span = currentResize.originalSpan - diff;
        }
        else if (resizeEvent.edges.right) {
            const /** @type {?} */ diff = Math.round(+resizeEvent.edges.right / dayWidth);
            weekEvent.span = currentResize.originalSpan + diff;
        }
    }
    /**
     * @hidden
     * @param {?} weekEvent
     * @return {?}
     */
    resizeEnded(weekEvent) {
        const /** @type {?} */ currentResize = this.currentResizes.get(weekEvent);
        let /** @type {?} */ daysDiff;
        if (currentResize.edge === 'left') {
            daysDiff = weekEvent.offset - currentResize.originalOffset;
        }
        else {
            daysDiff = weekEvent.span - currentResize.originalSpan;
        }
        weekEvent.offset = currentResize.originalOffset;
        weekEvent.span = currentResize.originalSpan;
        let /** @type {?} */ newStart = weekEvent.event.start;
        let /** @type {?} */ newEnd = weekEvent.event.end;
        if (currentResize.edge === 'left') {
            newStart = addDays(newStart, daysDiff);
        }
        else if (newEnd) {
            newEnd = addDays(newEnd, daysDiff);
        }
        this.eventTimesChanged.emit({ newStart, newEnd, event: weekEvent.event });
        this.currentResizes.delete(weekEvent);
    }
    /**
     * @hidden
     * @param {?} weekEvent
     * @param {?} draggedByPx
     * @param {?} dayWidth
     * @return {?}
     */
    eventDragged(weekEvent, draggedByPx, dayWidth) {
        const /** @type {?} */ daysDragged = draggedByPx / dayWidth;
        const /** @type {?} */ newStart = addDays(weekEvent.event.start, daysDragged);
        let /** @type {?} */ newEnd;
        if (weekEvent.event.end) {
            newEnd = addDays(weekEvent.event.end, daysDragged);
        }
        this.eventTimesChanged.emit({ newStart, newEnd, event: weekEvent.event });
    }
    /**
     * @hidden
     * @param {?} eventRowContainer
     * @return {?}
     */
    getDayColumnWidth(eventRowContainer) {
        return Math.floor(eventRowContainer.offsetWidth / this.days.length);
    }
    /**
     * @hidden
     * @param {?} weekViewContainer
     * @param {?} event
     * @return {?}
     */
    dragStart(weekViewContainer, event) {
        this.dayColumnWidth = this.getDayColumnWidth(weekViewContainer);
        const /** @type {?} */ dragHelper = new CalendarDragHelper(weekViewContainer, event);
        this.validateDrag = ({ x, y }) => this.currentResizes.size === 0 && dragHelper.validateDrag({ x, y });
        this.cdr.markForCheck();
    }
    /**
     * @return {?}
     */
    refreshHeader() {
        this.days = this.utils.getWeekViewHeader({
            viewDate: this.viewDate,
            weekStartsOn: this.weekStartsOn,
            excluded: this.excludeDays,
            weekendDays: this.weekendDays
        });
        this.emitBeforeViewRender();
    }
    /**
     * @return {?}
     */
    refreshBody() {
        this.view = this.utils.getWeekView({
            events: this.events,
            viewDate: this.viewDate,
            weekStartsOn: this.weekStartsOn,
            excluded: this.excludeDays,
            precision: this.precision,
            absolutePositionedEvents: true
        });
        this.emitBeforeViewRender();
    }
    /**
     * @return {?}
     */
    refreshAll() {
        this.refreshHeader();
        this.refreshBody();
    }
    /**
     * @return {?}
     */
    emitBeforeViewRender() {
        if (this.days && this.view) {
            this.beforeViewRender.emit({
                header: this.days,
                period: this.view.period
            });
        }
    }
}
CalendarWeekViewComponent.decorators = [
    { type: Component, args: [{
                selector: 'mwl-calendar-week-view',
                template: `
    <div class="cal-week-view" #weekViewContainer>
      <mwl-calendar-week-view-header
        [days]="days"
        [locale]="locale"
        [customTemplate]="headerTemplate"
        (dayHeaderClicked)="dayHeaderClicked.emit($event)"
        (eventDropped)="eventTimesChanged.emit($event)">
      </mwl-calendar-week-view-header>
      <div *ngFor="let eventRow of view.eventRows; trackBy:trackByIndex" #eventRowContainer class="cal-events-row">
        <div
          *ngFor="let weekEvent of eventRow.row; trackBy:trackByEventId"
          #event
          class="cal-event-container"
          [class.cal-draggable]="weekEvent.event.draggable"
          [class.cal-starts-within-week]="!weekEvent.startsBeforeWeek"
          [class.cal-ends-within-week]="!weekEvent.endsAfterWeek"
          [ngClass]="weekEvent.event?.cssClass"
          [style.width]="((100 / days.length) * weekEvent.span) + '%'"
          [style.marginLeft]="((100 / days.length) * weekEvent.offset) + '%'"
          mwlResizable
          [resizeEdges]="{left: weekEvent.event?.resizable?.beforeStart, right: weekEvent.event?.resizable?.afterEnd}"
          [resizeSnapGrid]="{left: dayColumnWidth, right: dayColumnWidth}"
          [validateResize]="validateResize"
          (resizeStart)="resizeStarted(weekViewContainer, weekEvent, $event)"
          (resizing)="resizing(weekEvent, $event, dayColumnWidth)"
          (resizeEnd)="resizeEnded(weekEvent)"
          mwlDraggable
          [dragAxis]="{x: weekEvent.event.draggable && currentResizes.size === 0, y: false}"
          [dragSnapGrid]="{x: dayColumnWidth}"
          [validateDrag]="validateDrag"
          (dragPointerDown)="dragStart(weekViewContainer, event)"
          (dragEnd)="eventDragged(weekEvent, $event.x, dayColumnWidth)">
          <mwl-calendar-week-view-event
            [weekEvent]="weekEvent"
            [tooltipPlacement]="tooltipPlacement"
            [tooltipTemplate]="tooltipTemplate"
            [tooltipAppendToBody]="tooltipAppendToBody"
            [customTemplate]="eventTemplate"
            [eventTitleTemplate]="eventTitleTemplate"
            (eventClicked)="eventClicked.emit({event: weekEvent.event})">
          </mwl-calendar-week-view-event>
        </div>
      </div>
    </div>
  `
            },] },
];
/** @nocollapse */
CalendarWeekViewComponent.ctorParameters = () => [
    { type: ChangeDetectorRef, },
    { type: CalendarUtils, },
    { type: undefined, decorators: [{ type: Inject, args: [LOCALE_ID,] },] },
];
CalendarWeekViewComponent.propDecorators = {
    "viewDate": [{ type: Input },],
    "events": [{ type: Input },],
    "excludeDays": [{ type: Input },],
    "refresh": [{ type: Input },],
    "locale": [{ type: Input },],
    "tooltipPlacement": [{ type: Input },],
    "tooltipTemplate": [{ type: Input },],
    "tooltipAppendToBody": [{ type: Input },],
    "weekStartsOn": [{ type: Input },],
    "headerTemplate": [{ type: Input },],
    "eventTemplate": [{ type: Input },],
    "eventTitleTemplate": [{ type: Input },],
    "precision": [{ type: Input },],
    "weekendDays": [{ type: Input },],
    "dayHeaderClicked": [{ type: Output },],
    "eventClicked": [{ type: Output },],
    "eventTimesChanged": [{ type: Output },],
    "beforeViewRender": [{ type: Output },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CalendarWeekViewHeaderComponent {
    constructor() {
        this.dayHeaderClicked = new EventEmitter();
        this.eventDropped = new EventEmitter();
        this.trackByWeekDayHeaderDate = trackByWeekDayHeaderDate;
    }
}
CalendarWeekViewHeaderComponent.decorators = [
    { type: Component, args: [{
                selector: 'mwl-calendar-week-view-header',
                template: `
    <ng-template
      #defaultTemplate
      let-days="days"
      let-locale="locale"
      let-dayHeaderClicked="dayHeaderClicked"
      let-eventDropped="eventDropped">
      <div class="cal-day-headers">
        <div
          class="cal-header"
          *ngFor="let day of days; trackBy:trackByWeekDayHeaderDate"
          [class.cal-past]="day.isPast"
          [class.cal-today]="day.isToday"
          [class.cal-future]="day.isFuture"
          [class.cal-weekend]="day.isWeekend"
          [class.cal-drag-over]="day.dragOver"
          [ngClass]="day.cssClass"
          (mwlClick)="dayHeaderClicked.emit({day: day})"
          mwlDroppable
          (dragEnter)="day.dragOver = true"
          (dragLeave)="day.dragOver = false"
          (drop)="day.dragOver = false; eventDropped.emit({event: $event.dropData.event, newStart: day.date})">
          <b>{{ day.date | calendarDate:'weekViewColumnHeader':locale }}</b><br>
          <span>{{ day.date | calendarDate:'weekViewColumnSubHeader':locale }}</span>
        </div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{days: days, locale: locale, dayHeaderClicked: dayHeaderClicked, eventDropped: eventDropped}">
    </ng-template>
  `
            },] },
];
/** @nocollapse */
CalendarWeekViewHeaderComponent.ctorParameters = () => [];
CalendarWeekViewHeaderComponent.propDecorators = {
    "days": [{ type: Input },],
    "locale": [{ type: Input },],
    "customTemplate": [{ type: Input },],
    "dayHeaderClicked": [{ type: Output },],
    "eventDropped": [{ type: Output },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CalendarWeekViewEventComponent {
    constructor() {
        this.eventClicked = new EventEmitter();
    }
}
CalendarWeekViewEventComponent.decorators = [
    { type: Component, args: [{
                selector: 'mwl-calendar-week-view-event',
                template: `
    <ng-template
      #defaultTemplate
      let-weekEvent="weekEvent"
      let-tooltipPlacement="tooltipPlacement"
      let-eventClicked="eventClicked"
      let-tooltipTemplate="tooltipTemplate"
      let-tooltipAppendToBody="tooltipAppendToBody">
      <div
        class="cal-event"
        [style.backgroundColor]="weekEvent.event.color.secondary"
        [mwlCalendarTooltip]="weekEvent.event.title | calendarEventTitle:'weekTooltip':weekEvent.event"
        [tooltipPlacement]="tooltipPlacement"
        [tooltipEvent]="weekEvent.event"
        [tooltipTemplate]="tooltipTemplate"
        [tooltipAppendToBody]="tooltipAppendToBody">
        <mwl-calendar-event-actions [event]="weekEvent.event"></mwl-calendar-event-actions>
        <mwl-calendar-event-title
          [event]="weekEvent.event"
          [customTemplate]="eventTitleTemplate"
          view="week"
          (mwlClick)="eventClicked.emit()">
        </mwl-calendar-event-title>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        weekEvent: weekEvent,
        tooltipPlacement: tooltipPlacement,
        eventClicked: eventClicked,
        tooltipTemplate: tooltipTemplate,
        tooltipAppendToBody: tooltipAppendToBody
      }">
    </ng-template>
  `
            },] },
];
/** @nocollapse */
CalendarWeekViewEventComponent.ctorParameters = () => [];
CalendarWeekViewEventComponent.propDecorators = {
    "weekEvent": [{ type: Input },],
    "tooltipPlacement": [{ type: Input },],
    "tooltipAppendToBody": [{ type: Input },],
    "customTemplate": [{ type: Input },],
    "eventTitleTemplate": [{ type: Input },],
    "tooltipTemplate": [{ type: Input },],
    "eventClicked": [{ type: Output },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CalendarWeekModule {
}
CalendarWeekModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    ResizableModule,
                    DragAndDropModule,
                    CalendarCommonModule
                ],
                declarations: [
                    CalendarWeekViewComponent,
                    CalendarWeekViewHeaderComponent,
                    CalendarWeekViewEventComponent
                ],
                exports: [
                    ResizableModule,
                    DragAndDropModule,
                    CalendarWeekViewComponent,
                    CalendarWeekViewHeaderComponent,
                    CalendarWeekViewEventComponent
                ]
            },] },
];
/** @nocollapse */
CalendarWeekModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */

/**
 * @hidden
 */
const MINUTES_IN_HOUR = 60;
/**
 * @hidden
 * @record
 */

/**
 * Shows all events on a given day. Example usage:
 *
 * ```typescript
 * <mwl-calendar-day-view
 *  [viewDate]="viewDate"
 *  [events]="events">
 * </mwl-calendar-day-view>
 * ```
 */
class CalendarDayViewComponent {
    /**
     * @hidden
     * @param {?} cdr
     * @param {?} utils
     * @param {?} locale
     */
    constructor(cdr, utils, locale) {
        this.cdr = cdr;
        this.utils = utils;
        /**
         * An array of events to display on view
         * The schema is available here: https://github.com/mattlewis92/calendar-utils/blob/c51689985f59a271940e30bc4e2c4e1fee3fcb5c/src/calendarUtils.ts#L49-L63
         */
        this.events = [];
        /**
         * The number of segments in an hour. Must be <= 6
         */
        this.hourSegments = 2;
        /**
         * The height in pixels of each hour segment
         */
        this.hourSegmentHeight = 30;
        /**
         * The day start hours in 24 hour time. Must be 0-23
         */
        this.dayStartHour = 0;
        /**
         * The day start minutes. Must be 0-59
         */
        this.dayStartMinute = 0;
        /**
         * The day end hours in 24 hour time. Must be 0-23
         */
        this.dayEndHour = 23;
        /**
         * The day end minutes. Must be 0-59
         */
        this.dayEndMinute = 59;
        /**
         * The width in pixels of each event on the view
         */
        this.eventWidth = 150;
        /**
         * The grid size to snap resizing and dragging of events to
         */
        this.eventSnapSize = this.hourSegmentHeight;
        /**
         * The placement of the event tooltip
         */
        this.tooltipPlacement = 'top';
        /**
         * Whether to append tooltips to the body or next to the trigger element
         */
        this.tooltipAppendToBody = true;
        /**
         * Called when an event title is clicked
         */
        this.eventClicked = new EventEmitter();
        /**
         * Called when an hour segment is clicked
         */
        this.hourSegmentClicked = new EventEmitter();
        /**
         * Called when an event is resized or dragged and dropped
         */
        this.eventTimesChanged = new EventEmitter();
        /**
         * An output that will be called before the view is rendered for the current day.
         * If you add the `cssClass` property to an hour grid segment it will add that class to the hour segment in the template
         */
        this.beforeViewRender = new EventEmitter();
        /**
         * @hidden
         */
        this.hours = [];
        /**
         * @hidden
         */
        this.width = 0;
        /**
         * @hidden
         */
        this.currentResizes = new Map();
        /**
         * @hidden
         */
        this.trackByEventId = trackByEventId;
        /**
         * @hidden
         */
        this.trackByDayEvent = (index, dayEvent) => dayEvent.event.id ? dayEvent.event.id : dayEvent.event;
        /**
         * @hidden
         */
        this.trackByHour = (index, hour) => hour.segments[0].date.toISOString();
        /**
         * @hidden
         */
        this.trackByHourSegment = (index, segment) => segment.date.toISOString();
        this.locale = locale;
    }
    /**
     * @hidden
     * @return {?}
     */
    ngOnInit() {
        if (this.refresh) {
            this.refreshSubscription = this.refresh.subscribe(() => {
                this.refreshAll();
                this.cdr.markForCheck();
            });
        }
    }
    /**
     * @hidden
     * @return {?}
     */
    ngOnDestroy() {
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }
    /**
     * @hidden
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes.viewDate ||
            changes.dayStartHour ||
            changes.dayStartMinute ||
            changes.dayEndHour ||
            changes.dayEndMinute ||
            changes.hourSegments) {
            this.refreshHourGrid();
        }
        if (changes.events) {
            validateEvents$1(this.events);
        }
        if (changes.viewDate ||
            changes.events ||
            changes.dayStartHour ||
            changes.dayStartMinute ||
            changes.dayEndHour ||
            changes.dayEndMinute ||
            changes.eventWidth) {
            this.refreshView();
        }
    }
    /**
     * @param {?} dropEvent
     * @param {?} segment
     * @return {?}
     */
    eventDropped(dropEvent, segment) {
        if (dropEvent.dropData && dropEvent.dropData.event) {
            this.eventTimesChanged.emit({
                event: dropEvent.dropData.event,
                newStart: segment.date
            });
        }
    }
    /**
     * @param {?} event
     * @param {?} resizeEvent
     * @param {?} dayViewContainer
     * @return {?}
     */
    resizeStarted(event, resizeEvent, dayViewContainer) {
        this.currentResizes.set(event, {
            originalTop: event.top,
            originalHeight: event.height,
            edge: typeof resizeEvent.edges.top !== 'undefined' ? 'top' : 'bottom'
        });
        const /** @type {?} */ resizeHelper = new CalendarResizeHelper(dayViewContainer);
        this.validateResize = ({ rectangle }) => resizeHelper.validateResize({ rectangle });
        this.cdr.markForCheck();
    }
    /**
     * @param {?} event
     * @param {?} resizeEvent
     * @return {?}
     */
    resizing(event, resizeEvent) {
        const /** @type {?} */ currentResize = this.currentResizes.get(event);
        if (resizeEvent.edges.top) {
            event.top = currentResize.originalTop + +resizeEvent.edges.top;
            event.height = currentResize.originalHeight - +resizeEvent.edges.top;
        }
        else if (resizeEvent.edges.bottom) {
            event.height = currentResize.originalHeight + +resizeEvent.edges.bottom;
        }
    }
    /**
     * @param {?} dayEvent
     * @return {?}
     */
    resizeEnded(dayEvent) {
        const /** @type {?} */ currentResize = this.currentResizes.get(dayEvent);
        let /** @type {?} */ pixelsMoved;
        if (currentResize.edge === 'top') {
            pixelsMoved = dayEvent.top - currentResize.originalTop;
        }
        else {
            pixelsMoved = dayEvent.height - currentResize.originalHeight;
        }
        dayEvent.top = currentResize.originalTop;
        dayEvent.height = currentResize.originalHeight;
        const /** @type {?} */ pixelAmountInMinutes = MINUTES_IN_HOUR / (this.hourSegments * this.hourSegmentHeight);
        const /** @type {?} */ minutesMoved = pixelsMoved * pixelAmountInMinutes;
        let /** @type {?} */ newStart = dayEvent.event.start;
        let /** @type {?} */ newEnd = dayEvent.event.end;
        if (currentResize.edge === 'top') {
            newStart = addMinutes(newStart, minutesMoved);
        }
        else if (newEnd) {
            newEnd = addMinutes(newEnd, minutesMoved);
        }
        this.eventTimesChanged.emit({ newStart, newEnd, event: dayEvent.event });
        this.currentResizes.delete(dayEvent);
    }
    /**
     * @param {?} event
     * @param {?} dayViewContainer
     * @return {?}
     */
    dragStart(event, dayViewContainer) {
        const /** @type {?} */ dragHelper = new CalendarDragHelper(dayViewContainer, event);
        this.validateDrag = ({ x, y }) => this.currentResizes.size === 0 && dragHelper.validateDrag({ x, y });
        this.cdr.markForCheck();
    }
    /**
     * @param {?} dayEvent
     * @param {?} draggedInPixels
     * @return {?}
     */
    eventDragged(dayEvent, draggedInPixels) {
        const /** @type {?} */ pixelAmountInMinutes = MINUTES_IN_HOUR / (this.hourSegments * this.hourSegmentHeight);
        const /** @type {?} */ minutesMoved = draggedInPixels * pixelAmountInMinutes;
        const /** @type {?} */ newStart = addMinutes(dayEvent.event.start, minutesMoved);
        let /** @type {?} */ newEnd;
        if (dayEvent.event.end) {
            newEnd = addMinutes(dayEvent.event.end, minutesMoved);
        }
        this.eventTimesChanged.emit({ newStart, newEnd, event: dayEvent.event });
    }
    /**
     * @return {?}
     */
    refreshHourGrid() {
        this.hours = this.utils.getDayViewHourGrid({
            viewDate: this.viewDate,
            hourSegments: this.hourSegments,
            dayStart: {
                hour: this.dayStartHour,
                minute: this.dayStartMinute
            },
            dayEnd: {
                hour: this.dayEndHour,
                minute: this.dayEndMinute
            }
        });
        this.emitBeforeViewRender();
    }
    /**
     * @return {?}
     */
    refreshView() {
        this.view = this.utils.getDayView({
            events: this.events,
            viewDate: this.viewDate,
            hourSegments: this.hourSegments,
            dayStart: {
                hour: this.dayStartHour,
                minute: this.dayStartMinute
            },
            dayEnd: {
                hour: this.dayEndHour,
                minute: this.dayEndMinute
            },
            eventWidth: this.eventWidth,
            segmentHeight: this.hourSegmentHeight
        });
        this.emitBeforeViewRender();
    }
    /**
     * @return {?}
     */
    refreshAll() {
        this.refreshHourGrid();
        this.refreshView();
    }
    /**
     * @return {?}
     */
    emitBeforeViewRender() {
        if (this.hours && this.view) {
            this.beforeViewRender.emit({
                body: {
                    hourGrid: this.hours
                },
                period: this.view.period
            });
        }
    }
}
CalendarDayViewComponent.decorators = [
    { type: Component, args: [{
                selector: 'mwl-calendar-day-view',
                template: `
    <div class="cal-day-view" #dayViewContainer>
      <mwl-calendar-all-day-event
        *ngFor="let event of view.allDayEvents; trackBy:trackByEventId"
        [event]="event"
        [customTemplate]="allDayEventTemplate"
        [eventTitleTemplate]="eventTitleTemplate"
        (eventClicked)="eventClicked.emit({event: event})">
      </mwl-calendar-all-day-event>
      <div class="cal-hour-rows">
        <div class="cal-events">
          <div
            #event
            *ngFor="let dayEvent of view?.events; trackBy:trackByDayEvent"
            class="cal-event-container"
            [class.cal-draggable]="dayEvent.event.draggable"
            [class.cal-starts-within-day]="!dayEvent.startsBeforeDay"
            [class.cal-ends-within-day]="!dayEvent.endsAfterDay"
            [ngClass]="dayEvent.event.cssClass"
            mwlResizable
            [resizeEdges]="{top: dayEvent.event?.resizable?.beforeStart, bottom: dayEvent.event?.resizable?.afterEnd}"
            [resizeSnapGrid]="{top: eventSnapSize, bottom: eventSnapSize}"
            [validateResize]="validateResize"
            (resizeStart)="resizeStarted(dayEvent, $event, dayViewContainer)"
            (resizing)="resizing(dayEvent, $event)"
            (resizeEnd)="resizeEnded(dayEvent)"
            mwlDraggable
            [dragAxis]="{x: false, y: dayEvent.event.draggable && currentResizes.size === 0}"
            [dragSnapGrid]="{y: eventSnapSize}"
            [validateDrag]="validateDrag"
            (dragPointerDown)="dragStart(event, dayViewContainer)"
            (dragEnd)="eventDragged(dayEvent, $event.y)"
            [style.marginTop.px]="dayEvent.top"
            [style.height.px]="dayEvent.height"
            [style.marginLeft.px]="dayEvent.left + 70"
            [style.width.px]="dayEvent.width - 1">
            <mwl-calendar-day-view-event
              [dayEvent]="dayEvent"
              [tooltipPlacement]="tooltipPlacement"
              [tooltipTemplate]="tooltipTemplate"
              [tooltipAppendToBody]="tooltipAppendToBody"
              [customTemplate]="eventTemplate"
              [eventTitleTemplate]="eventTitleTemplate"
              (eventClicked)="eventClicked.emit({event: dayEvent.event})">
            </mwl-calendar-day-view-event>
          </div>
        </div>
        <div class="cal-hour" *ngFor="let hour of hours; trackBy:trackByHour" [style.minWidth.px]="view?.width + 70">
          <mwl-calendar-day-view-hour-segment
            *ngFor="let segment of hour.segments; trackBy:trackByHourSegment"
            [style.height.px]="hourSegmentHeight"
            [segment]="segment"
            [segmentHeight]="hourSegmentHeight"
            [locale]="locale"
            [customTemplate]="hourSegmentTemplate"
            (click)="hourSegmentClicked.emit({date: segment.date})"
            [class.cal-drag-over]="segment.dragOver"
            mwlDroppable
            (dragEnter)="segment.dragOver = true"
            (dragLeave)="segment.dragOver = false"
            (drop)="segment.dragOver = false; eventDropped($event, segment)">
          </mwl-calendar-day-view-hour-segment>
        </div>
      </div>
    </div>
  `
            },] },
];
/** @nocollapse */
CalendarDayViewComponent.ctorParameters = () => [
    { type: ChangeDetectorRef, },
    { type: CalendarUtils, },
    { type: undefined, decorators: [{ type: Inject, args: [LOCALE_ID,] },] },
];
CalendarDayViewComponent.propDecorators = {
    "viewDate": [{ type: Input },],
    "events": [{ type: Input },],
    "hourSegments": [{ type: Input },],
    "hourSegmentHeight": [{ type: Input },],
    "dayStartHour": [{ type: Input },],
    "dayStartMinute": [{ type: Input },],
    "dayEndHour": [{ type: Input },],
    "dayEndMinute": [{ type: Input },],
    "eventWidth": [{ type: Input },],
    "refresh": [{ type: Input },],
    "locale": [{ type: Input },],
    "eventSnapSize": [{ type: Input },],
    "tooltipPlacement": [{ type: Input },],
    "tooltipTemplate": [{ type: Input },],
    "tooltipAppendToBody": [{ type: Input },],
    "hourSegmentTemplate": [{ type: Input },],
    "allDayEventTemplate": [{ type: Input },],
    "eventTemplate": [{ type: Input },],
    "eventTitleTemplate": [{ type: Input },],
    "eventClicked": [{ type: Output },],
    "hourSegmentClicked": [{ type: Output },],
    "eventTimesChanged": [{ type: Output },],
    "beforeViewRender": [{ type: Output },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CalendarAllDayEventComponent {
    constructor() {
        this.eventClicked = new EventEmitter();
    }
}
CalendarAllDayEventComponent.decorators = [
    { type: Component, args: [{
                selector: 'mwl-calendar-all-day-event',
                template: `
    <ng-template
      #defaultTemplate
      let-event="event"
      let-eventClicked="eventClicked">
      <div
        class="cal-all-day-event"
        [style.backgroundColor]="event.color.secondary"
        [style.borderColor]="event.color.primary">
        <mwl-calendar-event-actions [event]="event"></mwl-calendar-event-actions>
        <mwl-calendar-event-title
          [event]="event"
          [customTemplate]="eventTitleTemplate"
          view="day"
          (mwlClick)="eventClicked.emit()">
        </mwl-calendar-event-title>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        event: event,
        eventClicked: eventClicked
      }">
    </ng-template>
  `
            },] },
];
/** @nocollapse */
CalendarAllDayEventComponent.ctorParameters = () => [];
CalendarAllDayEventComponent.propDecorators = {
    "event": [{ type: Input },],
    "customTemplate": [{ type: Input },],
    "eventTitleTemplate": [{ type: Input },],
    "eventClicked": [{ type: Output },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CalendarDayViewHourSegmentComponent {
}
CalendarDayViewHourSegmentComponent.decorators = [
    { type: Component, args: [{
                selector: 'mwl-calendar-day-view-hour-segment',
                template: `
    <ng-template
      #defaultTemplate
      let-segment="segment"
      let-locale="locale">
      <div
        class="cal-hour-segment"
        [style.height.px]="segmentHeight"
        [class.cal-hour-start]="segment.isStart"
        [class.cal-after-hour-start]="!segment.isStart"
        [ngClass]="segment.cssClass">
        <div class="cal-time">
          {{ segment.date | calendarDate:'dayViewHour':locale }}
        </div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        segment: segment,
        locale: locale
      }">
    </ng-template>
  `
            },] },
];
/** @nocollapse */
CalendarDayViewHourSegmentComponent.ctorParameters = () => [];
CalendarDayViewHourSegmentComponent.propDecorators = {
    "segment": [{ type: Input },],
    "segmentHeight": [{ type: Input },],
    "locale": [{ type: Input },],
    "customTemplate": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CalendarDayViewEventComponent {
    constructor() {
        this.eventClicked = new EventEmitter();
    }
}
CalendarDayViewEventComponent.decorators = [
    { type: Component, args: [{
                selector: 'mwl-calendar-day-view-event',
                template: `
    <ng-template
      #defaultTemplate
      let-dayEvent="dayEvent"
      let-tooltipPlacement="tooltipPlacement"
      let-eventClicked="eventClicked"
      let-tooltipTemplate="tooltipTemplate"
      let-tooltipAppendToBody="tooltipAppendToBody">
      <div
        class="cal-event"
        [style.backgroundColor]="dayEvent.event.color.secondary"
        [style.borderColor]="dayEvent.event.color.primary"
        [mwlCalendarTooltip]="dayEvent.event.title | calendarEventTitle:'dayTooltip':dayEvent.event"
        [tooltipPlacement]="tooltipPlacement"
        [tooltipEvent]="dayEvent.event"
        [tooltipTemplate]="tooltipTemplate"
        [tooltipAppendToBody]="tooltipAppendToBody">
        <mwl-calendar-event-actions [event]="dayEvent.event"></mwl-calendar-event-actions>
        <mwl-calendar-event-title
          [event]="dayEvent.event"
          [customTemplate]="eventTitleTemplate"
          view="day"
          (mwlClick)="eventClicked.emit()">
        </mwl-calendar-event-title>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        dayEvent: dayEvent,
        tooltipPlacement: tooltipPlacement,
        eventClicked: eventClicked,
        tooltipTemplate: tooltipTemplate,
        tooltipAppendToBody: tooltipAppendToBody
      }">
    </ng-template>
  `
            },] },
];
/** @nocollapse */
CalendarDayViewEventComponent.ctorParameters = () => [];
CalendarDayViewEventComponent.propDecorators = {
    "dayEvent": [{ type: Input },],
    "tooltipPlacement": [{ type: Input },],
    "tooltipAppendToBody": [{ type: Input },],
    "customTemplate": [{ type: Input },],
    "eventTitleTemplate": [{ type: Input },],
    "tooltipTemplate": [{ type: Input },],
    "eventClicked": [{ type: Output },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CalendarDayModule {
}
CalendarDayModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    ResizableModule,
                    DragAndDropModule,
                    CalendarCommonModule
                ],
                declarations: [
                    CalendarDayViewComponent,
                    CalendarAllDayEventComponent,
                    CalendarDayViewHourSegmentComponent,
                    CalendarDayViewEventComponent
                ],
                exports: [
                    ResizableModule,
                    DragAndDropModule,
                    CalendarDayViewComponent,
                    CalendarAllDayEventComponent,
                    CalendarDayViewHourSegmentComponent,
                    CalendarDayViewEventComponent
                ]
            },] },
];
/** @nocollapse */
CalendarDayModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * The main module of this library. Example usage:
 *
 * ```typescript
 * import { CalenderModule } from 'angular-calendar';
 *
 * \@NgModule({
 *   imports: [
 *     CalenderModule.forRoot()
 *   ]
 * })
 * class MyModule {}
 * ```
 *
 */
class CalendarModule {
    /**
     * @param {?=} config
     * @return {?}
     */
    static forRoot(config = {}) {
        return {
            ngModule: CalendarModule,
            providers: [
                DraggableHelper,
                config.eventTitleFormatter || CalendarEventTitleFormatter,
                config.dateFormatter || CalendarDateFormatter,
                config.utils || CalendarUtils
            ]
        };
    }
}
CalendarModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CalendarCommonModule,
                    CalendarMonthModule,
                    CalendarWeekModule,
                    CalendarDayModule
                ],
                exports: [
                    CalendarCommonModule,
                    CalendarMonthModule,
                    CalendarWeekModule,
                    CalendarDayModule
                ]
            },] },
];
/** @nocollapse */
CalendarModule.ctorParameters = () => [];

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

export { CalendarModule, CalendarCommonModule, CalendarEventTitleFormatter, MOMENT, CalendarMomentDateFormatter, CalendarNativeDateFormatter, CalendarAngularDateFormatter, CalendarDateFormatter, CalendarUtils, CalendarMonthViewComponent, CalendarMonthModule, CalendarWeekViewComponent, CalendarWeekModule, CalendarDayViewComponent, CalendarDayModule, CalendarDatePipe as ɵh, CalendarEventActionsComponent as ɵa, CalendarEventTitleComponent as ɵb, CalendarEventTitlePipe as ɵi, CalendarNextViewDirective as ɵf, CalendarPreviousViewDirective as ɵe, CalendarTodayDirective as ɵg, CalendarTooltipDirective as ɵd, CalendarTooltipWindowComponent as ɵc, ClickDirective as ɵj, CalendarAllDayEventComponent as ɵp, CalendarDayViewEventComponent as ɵr, CalendarDayViewHourSegmentComponent as ɵq, CalendarMonthCellComponent as ɵk, CalendarMonthViewHeaderComponent as ɵm, CalendarOpenDayEventsComponent as ɵl, CalendarWeekViewEventComponent as ɵo, CalendarWeekViewHeaderComponent as ɵn };
//# sourceMappingURL=angular-calendar.js.map
