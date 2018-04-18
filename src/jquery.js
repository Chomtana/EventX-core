import {on,off} from './main.js';

if (typeof JQuery !== 'undefined') $ = jQuery;

var $on,$off;

if (typeof $ !== 'undefined') {
    $on = $.prototype.on;
    $off = $.prototype.off;

    $.prototype.on = function(event,selector,data,handler) {
        //backup old variable
        var $event = event;
        var $selector = selector;
        var $data = data;
        var $handler = handler;

        //Rearrange order of arguments to correct order
        if (selector && typeof selector === "function") {
            handler = selector;
            selector = null;
            data = null;
        }
        if (data && typeof data === "function") {
            handler = data;
            data = null;
        }
        if (selector && typeof selector !== "string") {
            data = selector;
            selector = null;
        }

        //event special case
        if ($.isPlainObject(event)) {
            $.each(events,(e,h)=>{
                $.prototype.on.call(this,e,selector,data,h);
            });
            return;
        } else if (typeof event === "string") {
            var events = event.split(" ");
            if (events.length>1) {
                //console.log(event,selector,data,handler);
                $.each(events,(i,e)=>{
                    $.prototype.on.call(this,e,selector,data,handler);
                });
                return;
            }
        }
        
        //console.log(event,selector,data,handler);

        if (data) {
            var oldhandler = handler;
            handler = function(e) {
                if (!e.data) e.data = data;
                oldhandler(e);
            }
        }

        if (this.length>0 && this[0]!=window/* && this[0]!=document*/) { //special case
            on((selector?this.find(selector):this),event,handler);
        }

        $on.call(this,$event,$selector,$data,$handler);
    }

    $.prototype.off = function(event,selector,handler) {
        //backup old variable
        var $event = event;
        var $selector = selector;
        var $handler = handler;

        //Rearrange order of arguments to correct order
        if (selector && typeof selector === "function") {
            handler = selector;
            selector = null;
        }

        //event special case
        if (!event) {
            off((selector?this.find(selector):this),event,handler);
            $off.call(this,$event,$selector,$handler);
            return;
        }

        if ($.isPlainObject(event)) {
            $.each(events,(e,h)=>{
                $.prototype.off.call(this,e,selector,h);
            });
            return;
        } else if (typeof event === "string") {
            var events = event.split(" ");
            if (events.length>1) {
                //console.log(event,selector,data,handler);
                $.each(events,(i,e)=>{
                    $.prototype.off.call(this,e,selector,handler);
                });
                return;
            }
        }

        if (this.length>0 && this[0]!=window/* && this[0]!=document*/) { //special case
            off((selector?this.find(selector):this),event,handler);
        }

        $off.call(this,$event,$selector,$handler);
    }
}

