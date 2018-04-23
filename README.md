# EventX-core

![Travis](https://img.shields.io/travis/Chomtana/EventX-core.svg)
[![Coverage Status](https://coveralls.io/repos/github/Chomtana/EventX-core/badge.svg?branch=master)](https://coveralls.io/github/Chomtana/EventX-core?branch=master)

Core of EventX javascript event framework

# Install
## Browser
```
<script src="..."></script>
```

## NPM
```
npm install eventx-core
```

# Create new event
## Normal event
### Syntax
```javascript
evx.createEvent("<event name>",function(target,callback) {
  //target is a single HTMLElement object that you need to bind event to (Always single HTMLElement)
  //callback is a function that you must call when event fire
  
  (bind event here)
  
  return function() {
    (unbind event here)
  }
}
```

### Example
[Resize event (evx.createEvent step line 7)](https://jsfiddle.net/Chomtana/306mjxLs/)

## Variable event

* Variable event is a new event type that event name have some variable.
* For example, I want to listen for change of attribute src and alt, so I have to bind attrchange:src and attrchange:alt event.
* To be able to bind these two event I must create two similar event. Can I create only one event? Yes, by using variable event.
* By using variable event you have to create variable event with prefix "attrchange" and you can bind all event that match pattern "attrchange:..."

### Syntax
```javascript
evx.createVarEvent("<event prefix>",function(target,args,callback) {
  //target is a single HTMLElement object that you need to bind event to (Always single HTMLElement)
  //args is an array of variable after <prefix>, for example <prefix>:src -> args = ["src"], <prefix>:src:alt -> args = ["src","alt"]
  //callback is a function that you must call when event fire
  
  (bind event here)
  
  return function() {
    (unbind event here)
  }
}
```

### Example

# Bind event

* In callback function this variable will be element that fire event.
* For example, if element #aaa has been resized, callback function will be called with this = HTMLElement object of #aaa and arguments up to what you have done in create event step.
* **Warning :** If you use arrow function, this will equal to Window object instead of target HTMLElement object.

## JQuery
### Syntax
```javascript
$("<selector>").on("<event name>",function(e,...) {
  ...
});

$("<selector>").on("<event name>","<selector>",function(e,...) {
  ...
});
```
And other syntax that you can find in http://api.jquery.com/on/

### Example
[Resize event (function jqueryon line 34)](https://jsfiddle.net/Chomtana/306mjxLs/)

## Native
### Syntax
```javascript
evx.on(target element in HTMLElement or JQuery object,"<event name>",function(e,...) {
  ...
})
```

### Example
[Resize event (function nojqueryon line 61)](https://jsfiddle.net/Chomtana/306mjxLs/)
