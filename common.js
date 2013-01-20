var forEach = function(array, func)
{
    for (var i = 0, len = array.length; i < len; ++i) {
        func(array[i]);
    }
}

/*
function Signal(element)
{
    this.listeners = [];
    this.element = element;

    var that = this;

    this.emit =
        function() {
            var args = []
            forEach(arguments, function(arg) { args.push(arg); });
            forEach(that.listeners, function(listener) { listener.callback.apply(listener.object, args); });
        }

    this.addListener =
        function(listener) {
            that.listeners.push(listener);
        }

    element.name = this;
}

function Property(element, name)
{
    this.element = element;

    var capitalized = name.substring(0, 1).toUpperCase() + name.substring(1);

    console.log("Adding property " + name + ", with setter set" + capitalized);

    var that = this;

    element["set" + capitalized] =
        function(value) {
            if (value === that.element[name])
                return;
            that.element[name] = value;
            that.signal.emit(value);
        }

    this.signal = element[name + "Changed"] = 
        new Signal(element);

    element[name + "Property"] = this;
}

function connect(sender, signal, receiver, slot)
{
    signal.addListener({ callback: slot, object: receiver });
}

function addBindings(object, bindings)
{
    for (binding in bindings) {
        if (object.hasOwnProperty(binding)) {
            console.log(object.name + "." + binding + " = " + bindings[binding]);
            object[binding] = bindings[binding];//binding.func.call(object);
            delete bindings[binding]
        }
    }
}

function Item(bindings)
{
    //this.addProperty("x", 0);
    this.x = 0;
    this.y = 0;
    this.width = 100;
    this.height = 100;

    addBindings(this, bindings);
}

function Rectangle(bindings)
{
    Item.call(this, bindings);

    this.colorProperty = new Property(this, "color");
    this.color = 'olive';
    this["color"] = "green";

    for (x in bindings) {
        if (this.hasOwnProperty(x) && !Item.hasOwnProperty(x))
            console.log("rect." + x + " = " + bindings[x]);
    }

    var element = document.createElement('div');
    element.style.backgroundColor = "olive";
    element.style.width = "500px";
    element.style.height = "100px";

    var child = document.createTextNode("Here I am!");
    element.appendChild(child);

    var root = document.getElementById('root');
    root.appendChild(element);

    console.log("Child appended");
    this.element = element;
}

Rectangle.prototype = Object.create(Item.prototype);
*/

basicelements = {}

function addElement(collection, elementDescription)
{
    this.test = false;
    this.sources = []

    var propertyController = this;

    function addProperty(name, elementDescription)
    {
        var propertyDescription = elementDescription.properties[name];
        var value = propertyDescription.value;
        var that = this;

        var handler = propertyDescription.hasOwnProperty("handler") ? propertyDescription.handler : null;

        var sinks = [];
        var source = { object: this, property: name, description: propertyDescription, sinks: sinks };

        var triggerBindings =
            function()
            {
                for (var i = 0, len = sinks.length; i < len; ++i)
                    sinks[i]();
            };

        Object.defineProperty(this, name, {
            get: function() { if (propertyController.test) propertyController.sources.push(source); return value; },
            set: function(v) { if (v === value) return; value = v; triggerBindings(); if (handler) handler.call(that, value); }
        });
    }

    function createSourceBinding(obj, binding, callback)
    {
        forEach (sources,
            function(source)
            {
                source.sinks.push(function() { obj[binding] = callback(); });
            });
    }

    var element = {
        description: elementDescription,
        constructor: function (parent)
        {
            if (elementDescription.hasOwnProperty("parent"))
                collection[elementDescription.parent].constructor.call(this, parent);

            var that = this;

            this.metaElement = element;

            if (elementDescription.hasOwnProperty("properties")) {
                for (prop in elementDescription.properties) {
                    addProperty.call(that, prop, elementDescription)
                }
            }

            if (elementDescription.hasOwnProperty("constructor")) {
                elementDescription.constructor.call(that, parent);
            }

            if (elementDescription.hasOwnProperty("properties")) {
                for (prop in elementDescription.properties) {
                    var propertyDescription = elementDescription.properties[prop];
                    if (propertyDescription.hasOwnProperty("handler"))
                        propertyDescription.handler.call(that, that[prop]);
                }
            }
        },
        applyBindings: function (bindings)
        {
            for (binding in bindings) {
                var value = bindings[binding];
                if (typeof value === "function") {
                    propertyController.test = true;
                    this[binding] = value();
                    propertyController.test = false;
                    createSourceBinding(this, binding, value);
                } else {
                    this[binding] = value;
                }
            }
        }
    };

    collection[elementDescription.name] = element;
}

addElement(basicelements,
    {
        name: "Element",
        constructor: function() {
            this.priv = {}
        }
    });

(function() {
    var styleSetter = function(key, suffix) {
        return suffix === undefined ?
            function(value) {
                this.priv.element.style[key] = value;
                console.log("Setting style " + key + " of div " + this.priv.element + " to " + value);
            } :
            function(value) {
                this.priv.element.style[key] = value + suffix;
            }
    };

    var styleSetterPixelDimension = function(key) { return styleSetter(key, "px"); }

    addElement(basicelements,
        {
            parent: "Element",
            name: "Item", 
            constructor: function(parent) {
                var element = this.priv.element = document.createElement('div');
                var root = parent ? parent.priv.element : document.getElementById("qmlroot");

                element.style.position = "absolute";

                //var child = document.createTextNode("Here I am!");
                //element.appendChild(child);
                root.appendChild(element);

                console.log("Created div " + element + " as child of " + parent);
            },
            properties: {
                x: { value: 0, handler: styleSetterPixelDimension("left") },
                y: { value: 0, handler: styleSetterPixelDimension("top") },
                width: { value: 100, handler: styleSetterPixelDimension("width") },
                height: { value: 100, handler: styleSetterPixelDimension("height") }
            }
        });

    addElement(basicelements,
        {
            parent: "Item",
            name: "Rectangle", 
            properties: {
                color: { value: "white", handler: styleSetter("backgroundColor") },
               foo: { value: "bar", handler: function(v) { console.log("foo value changed:" + v); }  }
            },
            constructor: function() {
            }
        });
})();

var animations = [];
var animationsRunning = false;

function animate() 
{
    var running = animations; 
    animations = [];

    for (var i = 0, len = running.length; i < len; ++i) {
        if (running[i].running) {
            running[i].process();
            animations.push(running[i]);
        }
    }
}

function startAnimation(animation)
{
    animations.push(animation);

    if (!animationsRunning) {
        var interval_60hz = 1000 / 60.0 ;
        var animFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(callback) { setTimeout(callback, interval_60hz); };

        var recursiveAnim = function() {
            animate();

            if (animations.length === 0) {
                animationsRunning = false;
            } else {
                animFrame(recursiveAnim);
            }
        }

        // start the mainloop
        animFrame(recursiveAnim);

        animationsRunning = true;
    }
}

function createAnimation()
{
    console.log("creating animation for property " + this.property + " of target " + this.target + " with duration " + this.duration);

    var running = true;
    var t = 0;
    var delta = this.to - this.from;
    var step = 1 / (60 * this.duration * 0.001);
    var that = this;

    function process()
    {
        t += step;
        
        if (t >= 1) {
            that.target[that.property] = that.to;
            running = false;
        } else {
            that.target[that.property] = that.from + delta * t;
        }
    }

    return { running: running, process: process }
}

addElement(basicelements,
    {
        parent: "Element",
        name: "NumberAnimation", 
        properties: {
            target: {},
            property: {},
            duration: { value: 1000 },
            from: { value: 0 },
            to: { value: 1 },
            running: { value: false, handler: function(v) { if (v) { startAnimation(createAnimation.call(this)) } } },
            loops: { value: 1 }
        }
    });

addElement(basicelements,
    {
        parent: "Element",
        name: "Behavior", 
        properties: {
            target: {},
            property: {}
        }
    });

function makeSetter(value, desc)
{
    return function() { 
        if (desc.hasOwnProperty("handler"))
            desc.handler(value);
    }
}

function createInstance(scope, elementName, parent)
{
    var object = null;
    for (var i = 0, len = scope.length; i < len; ++i) {
        if (scope[i].hasOwnProperty(elementName)) {
            object = new scope[i][elementName].constructor(parent);
            break;
        }
    }

    return object;
}

function applyBindings(obj, bindings)
{
    obj.metaElement.applyBindings.call(obj, bindings);
}

function initialize()
{
    /*
    var rect = new Rectangle();

    connect(rect, rect.colorChanged, null, function(value) { console.log("New color: " + value) })

    rect.setColor("maroon")
    rect.setColor("blue")

    console.log("Initialized: " + rect.color);

    var item = new Rectangle({x:2, y:2, color:"red"})
    var item = 2
    var obj = {};

    Object.defineProperty( obj, "value", {
          value: true,
          writable: false,
          enumerable: true,
          configurable: true
    });

    (function(){
          var name = "John";
           
            Object.defineProperty( obj, "name", {
                    get: function(){ return name; },
                    set: function(value){ name = value; }
              });
    })();

    console.log( obj.value )
    // true

    console.log( obj.name );
    // John

    if (typeof Object.defineProperty == 'function')
        console.log("Browser supports defineProperty!");
    */

    var scope = [ basicelements ];
/*
    var obj = createInstance(scope, "Rectangle");

    console.log(Object.getOwnPropertyNames(basicelements));
    console.log(Object.getOwnPropertyNames(obj));

    obj.color = "olive";
    obj.x = 40;
    obj.y = 20;
    obj.width = 200;
    obj.height = 200;

    var child = createInstance(scope, "Rectangle", obj);
    applyBindings(child, { color: "#FF3300", width: 40, height: function() { return 60; } });

    var child2 = createInstance(scope, "Rectangle", obj);
    applyBindings(child2, { color: "#FF0033", width: 40, height: 40, x: function() { return child.x + 80; }, y: function() { return 1.5 * child.x; }, width: 40, height: function() { return 60; } });
*/

    initQml();

    var o1 = { prototype: { x: 2 } };

    o2 = Object.create(o1)
    o2.x = 2

    var y = 2;

    Object.defineProperty(o2, "y", {
        get: function() { console.log("y observed as being " + y); return y; },
        set: function(v) { if (v === y) return; console.log("y changed from " + y + " to " + v); y = v; }
    });

    o2.y = 4
    var z = o2.y
    y = 3
    o2.y = 2
    z = o2.y

    var f
    with (o2) { f = function() {var w = o2.y; console.log("i2"); console.log("x: " + x + ", y: " + y); } }

    console.log("calling f");
    f();
}

