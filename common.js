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

function addProperty(name, elementDescription)
{
    var propertyDescription = elementDescription.properties[name];
    var value = propertyDescription.value;
    var that = this;

    var handler = propertyDescription.hasOwnProperty("handler") ? propertyDescription.handler : null;

    Object.defineProperty(this, name, {
        get: function() { return value; },
        set: function(v) { if (v === value) return; value = v; if (handler) handler.call(that, value); }
    });
}

function addElement(collection, elementDescription)
{
    var element = {
        description: elementDescription,
        constructor: function (parent)
        {
            console.log("constructor invoked with parent " + parent);
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
                console.log("calling constructor with parent " + parent);
                elementDescription.constructor.call(that, parent);
            }

            if (elementDescription.hasOwnProperty("properties")) {
                for (prop in elementDescription.properties) {
                    var propertyDescription = elementDescription.properties[prop];
                    if (propertyDescription.hasOwnProperty("handler"))
                        propertyDescription.handler.call(that, that[prop]);
                }
            }

            console.log("Created element " + elementDescription.name + " with parent " + elementDescription.parent);
            console.log("Properties: " + Object.getOwnPropertyNames(that));
        },
        applyBindings: function (bindings)
        {
            for (binding in bindings) {
                var value = bindings[binding];
                if (typeof value === "function") {
                    this[binding] = value();
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
                console.log("Setting style " + key + " of div " + this.priv.element + " to " + value + suffix);
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

addElement(basicelements,
    {
        parent: "Element",
        name: "NumberAnimation", 
        properties: {
            target: {},
            duration: { value: 1000 },
            from: { value: 0 },
            to: { value: 1 }
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
            console.log("invoking constructor with parent " + parent)
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
    var obj = createInstance(scope, "Rectangle");

    console.log(Object.getOwnPropertyNames(basicelements));
    console.log(Object.getOwnPropertyNames(obj));

    obj.color = "olive";
    obj.x = 40;
    obj.y = 20;
    obj.width = 200;
    obj.height = 200;

    /*
    child.color = "#FF3300"
    child.width = 40
    child.height = 40
    */

    var child = createInstance(scope, "Rectangle", obj);
    applyBindings(child, { color: "#FF3300", width: 40, height: function() { return 65; } });

    console.log("child.x:", child.x);

    var child2 = createInstance(scope, "Rectangle", obj);
    applyBindings(child2, { color: "#FF0033", width: 40, height: 40, x: function() { console.log("Invoked with child: " + child + ", x: " + child.x); return child.x + 80; }, width: 40, height: function() { return 65; } });

    console.log("child2.x:", child2.x);

    var o1 = { prototype: { x: 2 } };

//    o2 = { y: 4 } 
//    o2.prototype = o1;
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

//    (function() { console.log("x: " + this.x + ", y: " + this.y); }).call(o2);

    var f
    with (o2) { f = function() {var w = o2.y; console.log("i2"); console.log("x: " + x + ", y: " + y); } }

    console.log("calling f");
    f();

    function animate() 
    {
        if (child.x < 40) child.x += 1;
    }

    var interval_60hz = 1000 / 60.0 ;
    var animFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback) { setTimeout(callback, interval_60hz); };

    var recursiveAnim = function() {
        animate();
        animFrame(recursiveAnim);
    }

    // start the mainloop
    animFrame(recursiveAnim);
}

