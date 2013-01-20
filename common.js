var forEach = function(array, func)
{
    for (var i = 0, len = array.length; i < len; ++i) {
        func(array[i]);
    }
}
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
                if (typeof value === "function" && this.hasOwnProperty(binding)) {
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

                root.appendChild(element);
            },
            properties: {
                x: { value: 0, handler: styleSetterPixelDimension("left") },
                y: { value: 0, handler: styleSetterPixelDimension("top") },
                width: { value: 100, handler: styleSetterPixelDimension("width") },
                height: { value: 100, handler: styleSetterPixelDimension("height") },
                opacity: { value: 1, handler: styleSetter("opacity") }
            }
        });

    addElement(basicelements,
        {
            parent: "Item",
            name: "Rectangle", 
            properties: {
                color: { value: "white", handler: styleSetter("backgroundColor") },
            },
            constructor: function() {}
        });

    var textSetter = function(v)
    {
        if (this.priv.textNode)
            this.priv.element.removeChild(this.priv.textNode);
        var text = document.createTextNode(v);
        this.priv.element.appendChild(text);
    }

    addElement(basicelements,
        {
            parent: "Item",
            name: "Text",
            properties: {
                text: { value: "", handler: textSetter }
            },
            constructor: function() {
                this.priv.textNode = null;
            }
        });
})();

addElement(basicelements,
    {
        parent: "Item",
        name: "MouseArea",
        properties: {
        },
        constructor: function() {
            var that = this;
            this.priv.element.onclick = function() { that.onClicked(); }
        }
    });

var animations = [];
var animationsRunning = false;

function animate() 
{
    var running = animations; 
    animations = [];

    for (var i = 0, len = running.length; i < len; ++i) {
        if (running[i].running()) {
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
    var t = 0;
    var delta = this.to - this.from;
    var step = 1 / (60 * this.duration * 0.001);
    var that = this;

    var loops = that.loops;

    function process()
    {
        if (t >= 1) {
            that.target[that.property] = that.to;
            if (that.loops === -1 || --loops > 0) {
                t = 0
            } else {
                that.running = false;
            }
        } else {
            that.target[that.property] = that.from + delta * t;
        }

        t += step;
        
    }

    return { running: function() { return that.running; }, process: process }
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
    initQml();
}

