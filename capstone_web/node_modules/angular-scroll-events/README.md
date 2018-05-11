# Angular directives for scroll events

Utility library to add support for `scroll-up` and `scroll-down` events

## Installation

1) Install 'g1b.angular-scroll-events' with npm or yarn

```
npm install angular-scroll-events
```

or:

```
yarn add angular-scroll-events
```

2) Add 'g1b.scroll-events' module to your app config

```javascript
angular.module('myApp', [
  'g1b.scroll-events',
  ...
])
```

3) Use 'scroll-up' and/or 'scroll-down' directive in a view

```html
<div scroll-up="log('scroll up')">↑ Scroll Up</div>
```

or:

```html
<div scroll-down="log('scroll down')">↓ Scroll Down</div>
```

## Example

See [index.html](https://github.com/g1eb/angular-scroll-events/blob/master/index.html) for an example implementation or click <a href="https://rawgit.com/g1eb/angular-scroll-events/master/" target="_blank">here</a> for an interactive demo
