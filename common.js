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

var forEach = function(array, func)
{
    for (var i = 0, len = array.length; i < len; ++i) {
        func(array[i]);
    }
}

function addElement(collection, elementDescription)
{
    this.test = false;
    this.sources = []

    var propertyController = this;

    function addPropertyImpl(name, propertyDescription)
    {
        var value = propertyDescription.value;
        var that = this;

        var handler = propertyDescription.hasOwnProperty("handler") ? propertyDescription.handler : null;

        var sinks = [];
        var source = { property: name, sinks: sinks };

        that.metaObject.propertyNotifiers[name] = sinks;

        var triggerBindings =
            function()
            {
                for (var i = 0, len = sinks.length; i < len; ++i)
                    sinks[i](value);
            };

        Object.defineProperty(this, name, {
            get: function() { if (propertyController.test) propertyController.sources.push(source); return value; },
            set: function(v) { if (v === value) return; value = v; triggerBindings(); if (handler) handler.call(that, value); }
        });
    }

    this.createSourceBinding = function(obj, binding, callback)
    {
        forEach (sources,
            function(source)
            {
                source.sinks.push(function() { obj[binding] = callback(); });
            });

        sources = []
    }

    var element = {
        description: elementDescription,
        constructor: function (parent)
        {
            if (elementDescription.hasOwnProperty("parent")) {
                elementDescription.parent.constructor.call(this, parent);
            } else {
                this.metaObject = { propertyNotifiers: {} };
            }

            var that = this;

            this.metaElement = element;

            if (elementDescription.hasOwnProperty("properties")) {
                for (prop in elementDescription.properties) {
                    addPropertyImpl.call(that, prop, elementDescription.properties[prop])
                }
            }

            if (elementDescription.hasOwnProperty("constructor"))
                elementDescription.constructor.call(this, parent);

            if (elementDescription.hasOwnProperty("properties")) {
                for (prop in elementDescription.properties) {
                    var propertyDescription = elementDescription.properties[prop];
                    if (propertyDescription.hasOwnProperty("handler"))
                        propertyDescription.handler.call(that, that[prop]);
                }
            }
        },
        childAdded: function (child)
        {
            if (elementDescription.hasOwnProperty("parent"))
                elementDescription.parent.childAdded.call(this, child);

            if (elementDescription.hasOwnProperty("childAdded"))
                elementDescription.childAdded.call(this, child);
        },
        applyBindings: function (bindings)
        {
            for (binding in bindings) {
                var value = bindings[binding];
                if (typeof value === "function" && this.hasOwnProperty(binding)) {
                    propertyController.test = true;
                    this[binding] = value();
                    propertyController.test = false;
                    propertyController.createSourceBinding(this, binding, value);
                } else {
                    this[binding] = value;
                }
            }
        },
        addListener: function (property, callback)
        {
            var notifiers = this.metaObject.propertyNotifiers[property];
            if (notifiers)
                notifiers.push(callback);
        },
        addProperty: function (prop)
        {
            var that = this;
            addPropertyImpl.call(that, prop, {});
        }
    };

    collection[elementDescription.name] = element;

    return element;
}

function makeSetter(value, desc)
{
    return function() { 
        if (desc.hasOwnProperty("handler"))
            desc.handler(value);
    }
}

function lookupElement(imports, name)
{
    for (var i = 0, len = imports.length; i < len; ++i) {
        if (imports[i].hasOwnProperty(name)) {
            return imports[i][name];
        }
    }
}

function createInstance(imports, elementName, parent)
{
    var element = lookupElement(imports, elementName);
    if (!element) {
        console.log("Failed to instantiate element " + elementName);
        return null;
    }

    var object = new element.constructor(parent);

    if (parent) {
        parent.metaElement.childAdded.call(parent, object);
    }

    return object;
}

function applyBindings(obj, bindings)
{
    obj.metaElement.applyBindings.call(obj, bindings);
}

function addProperty(obj, property)
{
    obj.metaElement.addProperty.call(obj, property);
}

function addListener(obj, property, callback)
{
    obj.metaElement.addListener.call(obj, property, callback);
}

function addPropertyProxy(scope, obj, property)
{
    Object.defineProperty(scope, property, {
        get: function() { return obj[property]; },
        set: function(v) { obj[property] = v; }
    });
}

function initialize()
{
    initQml();
}

