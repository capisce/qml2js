/*
   Copyright (c) 2013 Samuel Rødal

   Permission is hereby granted, free of charge, to any person obtaining a
   copy of this software and associated documentation files (the "Software"),
   to deal in the Software without restriction, including without limitation
   the rights to use, copy, modify, merge, publish, distribute, sublicense,
   and/or sell copies of the Software, and to permit persons to whom the
   Software is furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in
   all copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
   FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
   DEALINGS IN THE SOFTWARE.
*/

basicelements = {}

var element = addElement(basicelements,
    {
        name: "Element",
        constructor: function(parent) {
            this.priv = { parent: parent, children: [] }
        },
        childAdded: function(child) {
            if (!child)
                console.log("child added: " + child);
            this.priv.children.push(child);
        }
    });

addElement(basicelements, { parent: element, name: "Component" });
addElement(basicelements, { parent: element, name: "ListModel" });
addElement(basicelements, { parent: element, name: "ListElement" });

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

    /*
    var updatePosition =
        function() {
            var translation = "translate3d(" + this.x + "px," + this.y + "px, 0)";
            var style = this.priv.element.style;
            style.transform = translation;
            style.OTransform = translation;
            style.msTransform = translation;
            style.MozTransform = translation;
            style.WebkitTransform = translation;
        }
    */

    var item = addElement(basicelements,
        {
            parent: element,
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

    var updateRepeater =
        function()
        {
            var delegate = this.delegate;
            if (!delegate && this.hasOwnProperty("_instantiateQml"))
                delegate = this;

            if (!this.model || !delegate)
                return;

            if (typeof this.model === "number") {
                for (var i = 0; i < this.model; ++i) {
                    delegate._instantiateQml(this.priv.parent, { index: i });
                }
            } else {
                var children = this.model.priv.children;
                for (var i = 0, len = children.length; i < len; ++i) {
                    var item = children[i];
                    if (!item)
                        continue; // ????
                    var scope = { index: i };
                    var props = Object.getOwnPropertyNames(item);
                    for (var j = 0, len = props.length; j < len; ++j) {
                        var property = props[j];
                        if (property === "priv" || property === "metaElement" || property === "metaObject")
                            continue;
                        addPropertyProxy(scope, item, property);
                    }
                    delegate._instantiateQml(this.priv.parent, scope);
                }
            }
        }

    addElement(basicelements,
        {
            parent: element,
            name: "Repeater",
            constructor: function(parent) {
                this.priv.repeaterChildren = []
                this.priv.repeaterParent = parent
            },
            properties: {
                model: { value: null, handler: updateRepeater },
                delegate: { value: null, handler: updateRepeater }
            }
        });

    var addLayouter = function (name, position, size) {
        var relayout =
            function()
            {
                var children = this.priv.children;
                var p = 0;
                for (var i = 0, len = children.length; i < len; ++i) {
                    var child = children[i];
                    if (child.metaElement.description.name === "Repeater")
                        continue;
                    if (child.height) {
                        child[position] = p;
                        p += child[size] + this.spacing;
                    }
                }
            }

        addElement(basicelements,
            {
                parent: item,
                name: name,
                properties: {
                    spacing: { value: 0, handler: relayout }
                },
                constructor: function(parent) {
                    var that = this;
                    this.priv.relayout = function()
                    {
                        relayout.call(that);
                    }
                },
                childAdded: function(child) {
                    if (child.metaElement.description.name === "Repeater")
                        return;
                    if (child[size] > 0)
                        this.priv.relayout();
                    addListener(child, size, this.priv.relayout);
                }
            });
    };

    addLayouter("Column", "y", "height");
    addLayouter("Row", "x", "width");

    var imageSetter = function(v)
    {
        this.priv.image.setAttribute("src", v);
        console.log("setting image source: " + v)
    }

    addElement(basicelements,
        {
            parent: item,
            name: "Image",
            properties: {
                source: { value: "", handler: imageSetter },
            },
            constructor: function() {
                var element = this.priv.image = document.createElement('img');
                this.priv.element.appendChild(element);
            }
        });

    addElement(basicelements,
        {
            parent: item,
            name: "Rectangle", 
            properties: {
                color: { value: "white", handler: styleSetter("backgroundColor") },
                radius: { value: 0, handler: styleSetterPixelDimension("borderRadius") }
            },
            constructor: function() {}
        });

    var textSetter = function(v)
    {
        if (this.priv.textNode) {
            this.priv.element.removeChild(this.priv.textNode);
            delete this.priv.textNode;
        }
        var text = this.priv.textNode = document.createTextNode(v);
        this.priv.element.appendChild(text);
    }

    addElement(basicelements,
        {
            parent: item,
            name: "Text",
            properties: {
                text: { value: "", handler: textSetter }
            },
            constructor: function() {
                this.priv.textNode = null;
            }
        });

    addElement(basicelements,
        {
            parent: item,
            name: "MouseArea",
            properties: {
            },
            constructor: function() {
                var that = this;
                this.priv.element.addEventListener("click", function(e) { that.onClicked();  }, false);
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
        parent: element,
        name: "NumberAnimation", 
        properties: {
            target: {},
            property: {},
            duration: { value: 1000 },
            from: { value: 0 },
            to: { value: 1, handler: function(v) {
                console.log("to set to " + v); }
            },
            loops: { value: 1 },
            running: { value: false, handler: function(v) { if (v) { startAnimation(createAnimation.call(this)) } } }
        }
    });

addElement(basicelements,
    {
        parent: element,
        name: "Behavior", 
        properties: {
            target: {},
            property: {}
        }
    });

