"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createEvent = createEvent;
exports.removeEvent = removeEvent;
exports.renameEvent = renameEvent;
exports.createVarEvent = createVarEvent;
exports.renameVarEvent = renameVarEvent;
exports.removeVarEvent = removeVarEvent;
exports.on = on;
exports.off = off;
//import $ from 'jquery';

if (typeof JQuery !== 'undefined') $ = jQuery;

var events = {};
var varevents = {};
var unbinds = exports.unbinds = {};
var setting = exports.setting = {}
/*    resizeObserverFirstRun : true,
    cssObserveEqualChange : false*/


/**
 * Create driver for a single event (If add to exisitng event type it will stack)
 * @param {string} name name of event
 * @param {(target:Element,callback:(e)=>boolean)=>()=>void} bind Bind function that takes target element (native HTMLElement) and callback and return unbind function (no argument) that unbind event that has been binded using bind function
 */
;function createEvent(name, bind) {
    if (!events[name]) events[name] = [];
    events[name].push(bind);
}

/**
 * Remove event driver created by createEvent function only (This function don't unbind events that has already binded)
 * @param {string} name name of event
 * @param {(target:Element,callback:(e)=>boolean)=>()=>void} bind Bind function that was used to pass into createEvent function (optional)
 */
function removeEvent(name, bind) {
    if (events[name]) {
        if (!bind) {
            events[name] = null;
        } else {
            for (var i = 0; i < events[name].length; i++) {
                if (events[name][i] == bind) {
                    events[name].splice(i, 1);
                    break;
                }
            }
        }
    }
}

function renameEvent(name, newname) {
    events[newname] = events[name];
    events[name] = null;
}

/**
 * Create driver for events that start with "<prefix>:" (If add to exisitng event type it will stack)
 * @param {string} prefix prefix of event (Ex: prefix=csschange will match "csschange:..." event)
 * @param {(target:Element,callback:(e)=>boolean)=>()=>void} bind Bind function that takes target element (native HTMLElement) and callback and return unbind function (no argument) that unbind event that has been binded using bind function
 */
function createVarEvent(prefix, bind) {
    if (!varevents[prefix]) varevents[prefix] = [];
    varevents[prefix].push(bind);
}

function renameVarEvent(name, newname) {
    varevents[newname] = varevents[name];
    varevents[name] = null;
}

/**
 * Remove event driver created by createVarEvent function only (This function don't unbind events that has already binded)
 * @param {string} prefix prefix of event
 * @param {(target:Element,callback:(e)=>boolean)=>()=>void} bind Bind function that was used to pass into createEvent function (optional)
 */
function removeVarEvent(prefix, bind) {
    if (varevents[prefix]) {
        if (!bind) {
            varevents[prefix] = null;
        } else {
            for (var i = 0; i < varevents[prefix].length; i++) {
                if (varevents[prefix][i] == bind) {
                    varevents[prefix].splice(i, 1);
                    break;
                }
            }
        }
    }
}

function on_single(target, name, callback) {
    if (!(target instanceof HTMLElement)) throw "target must be an instance of HTMLElement or JQuery";
    if (events[name]) {
        events[name].forEach(function (event) {
            if (!target.unbinds) target.unbinds = {};
            if (!target.unbinds[name]) target.unbinds[name] = {};
            if (!target.unbinds[name][callback]) target.unbinds[name][callback] = [];
            target.unbinds[name][callback].push(event(target, callback.bind(target)));
        });
    }
}

function on_single_var(target, name, args, callback) {
    if (varevents[name]) {
        varevents[name].forEach(function (event) {
            if (!target.varunbinds) target.varunbinds = {};
            if (!target.varunbinds[name]) target.varunbinds[name] = {};
            if (!target.varunbinds[name][args]) target.varunbinds[name][args] = {};
            if (!target.varunbinds[name][args][callback]) target.varunbinds[name][args][callback] = [];
            target.varunbinds[name][args][callback].push(event(target, args, callback.bind(target)));
        });
    }
}

function on(target, name, callback) {
    var part = name.split(":");
    if (typeof $ !== 'undefined') {
        $(target).each(function (index, ele) {
            on_single(ele, name, callback);
        });
    } else {
        on_single(target, name, callback);
    }

    //Variable event
    if (part.length > 1) {
        var firstpart = part[0];
        part.shift();

        if (typeof $ !== 'undefined') {
            $(target).each(function (index, ele) {
                on_single_var(ele, firstpart, part, callback);
            });
        } else {
            on_single_var(target, firstpart, part, callback);
        }
    }
}

function off_single(target, name, callback) {
    if (!name) {
        if (target.unbinds) {
            for (var unbind_ in target.unbinds) {
                off_single(target, unbind_);
            }
            target.unbinds = null;
        }
        return;
    }
    if (!callback) {
        if (target.unbinds && target.unbinds[name]) {
            for (var unbind_ in target.unbinds[name]) {
                off_single(target, name, unbind_);
            }
            target.unbinds[name] = null;
        }
        return;
    }
    if (target.unbinds && target.unbinds[name] && target.unbinds[name][callback]) {
        target.unbinds[name][callback].forEach(function (unbind) {
            unbind();
        });
        target.unbinds[name][callback] = null;
    }
}

function off_single_var(target, name, args, callback) {
    if (!name) {
        if (target.varunbinds) {
            for (var unbind_ in target.varunbinds) {
                off_single_var(target, unbind_);
            }
            target.varunbinds = null;
        }
        return;
    }
    if (!args) {
        if (target.varunbinds && target.varunbinds[name]) {
            for (var unbind_ in target.varunbinds[name]) {
                off_single_var(target, name, unbind_);
            }
            target.varunbinds[name] = null;
        }
        return;
    }
    if (!callback) {
        if (target.varunbinds && target.varunbinds[name] && target.varunbinds[name][args]) {
            for (var unbind_ in target.varunbinds[name][args]) {
                off_single_var(target, name, args, unbind_);
            }
            target.varunbinds[name][args] = null;
        }
        return;
    }
    if (target.varunbinds && target.varunbinds[name] && target.varunbinds[name][args] && target.varunbinds[name][args][callback]) {
        target.varunbinds[name][args][callback].forEach(function (unbind) {
            unbind();
        });
        target.varunbinds[name][args][callback] = null;
    }
}

function off(target, name, callback) {
    var part = name.split(":");

    if (typeof $ !== 'undefined') {
        $(target).each(function (index, ele) {
            off_single(ele, name, callback);
        });
    } else {
        off_single(target, name, callback);
    }

    //Variable event
    if (part.length > 1) {
        var firstpart = part[0];
        part.shift();

        if (typeof $ !== 'undefined') {
            $(target).each(function (index, ele) {
                off_single_var(ele, firstpart, part, callback);
            });
        } else {
            off_single_var(target, firstpart, part, callback);
        }
    }
}

exports.default = {
    createEvent: createEvent,
    createVarEvent: createVarEvent,
    removeEvent: removeEvent,
    removeVarEvent: removeVarEvent,
    renameEvent: renameEvent,
    renameVarEvent: renameVarEvent,
    on: on,
    off: off,
    setting: setting,
    unbinds: unbinds
};


require("./jquery.js");