// this code was auto-generated by qml2js
function initQml() {
    var applicationelements = {};
    var imports = [ basicelements, applicationelements ];
    // SimpleModel.qml
    addElement(applicationelements,
    {
        parent: lookupElement(imports, "ListModel"),
        name: "SimpleModel",
        properties: {

        },
        constructor: function() {
            var _qml_id_ListModel = this;
            var _qml_id_1_ListElement = createInstance(imports, "ListElement", _qml_id_ListModel);
            addProperty(_qml_id_1_ListElement, "name");
            var _qml_id_2_ListElement = createInstance(imports, "ListElement", _qml_id_ListModel);
            addProperty(_qml_id_2_ListElement, "name");
            var _qml_id_3_ListElement = createInstance(imports, "ListElement", _qml_id_ListModel);
            addProperty(_qml_id_3_ListElement, "name");
            var _qml_id_1_ListElement_scope = {};
            addPropertyProxy(_qml_id_1_ListElement_scope, _qml_id_1_ListElement, "name");
            with (_qml_id_1_ListElement_scope) {
                with (_qml_id_1_ListElement) applyBindings(_qml_id_1_ListElement, {
                    name: function() { return "Element A" }
                });
            }
            var _qml_id_2_ListElement_scope = {};
            addPropertyProxy(_qml_id_2_ListElement_scope, _qml_id_2_ListElement, "name");
            with (_qml_id_2_ListElement_scope) {
                with (_qml_id_2_ListElement) applyBindings(_qml_id_2_ListElement, {
                    name: function() { return "Element B" }
                });
            }
            var _qml_id_3_ListElement_scope = {};
            addPropertyProxy(_qml_id_3_ListElement_scope, _qml_id_3_ListElement, "name");
            with (_qml_id_3_ListElement_scope) {
                with (_qml_id_3_ListElement) applyBindings(_qml_id_3_ListElement, {
                    name: function() { return "Element C" }
                });
            }
        }
    });
    // Label.qml
    addElement(applicationelements,
    {
        parent: lookupElement(imports, "Rectangle"),
        name: "Label",
        properties: {
            buttonColor: {},
            labelText: {}
        },
        constructor: function() {
            var _qml_id_Rectangle = this;
            var _qml_id_1_Text = createInstance(imports, "Text", _qml_id_Rectangle);
            var _qml_id_Rectangle_scope = {};
            addPropertyProxy(_qml_id_Rectangle_scope, _qml_id_Rectangle, "buttonColor");
            addPropertyProxy(_qml_id_Rectangle_scope, _qml_id_Rectangle, "labelText");
            with (_qml_id_Rectangle_scope) {
                with (_qml_id_Rectangle) applyBindings(_qml_id_Rectangle, {
                    buttonColor: function() { return "#59d" },
                    labelText: function() { return "" },
                    width: function() { return 80 },
                    height: function() { return 24 },
                    color: function() { return buttonColor },
                    radius: function() { return 8 }
                });
                with (_qml_id_1_Text) applyBindings(_qml_id_1_Text, {
                    width: function() { return 200 },
                    height: function() { return 24 },
                    x: function() { return 4 },
                    y: function() { return 4 },
                    text: function() { return labelText }
                });
            }
        }
    });
    // Button.qml
    addElement(applicationelements,
    {
        parent: lookupElement(imports, "MouseArea"),
        name: "Button",
        properties: {
            buttonText: {}
        },
        constructor: function() {
            var _qml_id_MouseArea = this;
            var label = createInstance(imports, "Label", _qml_id_MouseArea);
            var _qml_id_MouseArea_scope = {};
            addPropertyProxy(_qml_id_MouseArea_scope, _qml_id_MouseArea, "buttonText");
            with (_qml_id_MouseArea_scope) {
                with (_qml_id_MouseArea) applyBindings(_qml_id_MouseArea, {
                    buttonText: function() { return "" },
                    width: function() { return 80 },
                    height: function() { return 24 }
                });
                with (label) applyBindings(label, {
                    width: function() { return parent.width },
                    height: function() { return parent.height },
                    labelText: function() { return buttonText }
                });
            }
        }
    });
    // Slider.qml
    addElement(applicationelements,
    {
        parent: lookupElement(imports, "Item"),
        name: "Slider",
        properties: {
            value: {}
        },
        constructor: function() {
            var _qml_id_Item = this;
            var _qml_id_1_Rectangle = createInstance(imports, "Rectangle", _qml_id_Item);
            var _qml_id_2_Rectangle = createInstance(imports, "Rectangle", _qml_id_Item);
            var _qml_id_2_1_MouseArea = createInstance(imports, "MouseArea", _qml_id_2_Rectangle);
            var _qml_id_Item_scope = {};
            addPropertyProxy(_qml_id_Item_scope, _qml_id_Item, "value");
            with (_qml_id_Item_scope) {
                with (_qml_id_Item) applyBindings(_qml_id_Item, {
                    value: function() { return 0 },
                    width: function() { return 600 },
                    height: function() { return 20 }
                });
                with (_qml_id_1_Rectangle) applyBindings(_qml_id_1_Rectangle, {
                    y: function() { return 5 },
                    color: function() { return "white" },
                    radius: function() { return 8 },
                    width: function() { return parent.width },
                    height: function() { return parent.height - 10 }
                });
                with (_qml_id_2_Rectangle) applyBindings(_qml_id_2_Rectangle, {
                    color: function() { return "darkgray" },
                    radius: function() { return 4 },
                    width: function() { return 16 },
                    height: function() { return parent.height }
                });
                with (_qml_id_2_1_MouseArea) applyBindings(_qml_id_2_1_MouseArea, {
                    width: function() { return parent.width },
                    height: function() { return parent.height }
                });
            }
        }
    });
    // example.qml
    var _qml_id_Item = createInstance(imports, "Item");
    var root = createInstance(imports, "Rectangle", _qml_id_Item);
    addProperty(root, "foo");
    addProperty(root, "buttonColor");
    addProperty(root, "up");
    addProperty(root, "t");
    addProperty(root, "frameCounter");
    addProperty(root, "fps");
    var component = createInstance(imports, "Component", root);
    var listModel = createInstance(imports, "SimpleModel", root);
    var _qml_id_1_3_Item = createInstance(imports, "Item", root);
    var _qml_id_1_3_1_Text = createInstance(imports, "Text", _qml_id_1_3_Item);
    var _qml_id_1_3_2_Row = createInstance(imports, "Row", _qml_id_1_3_Item);
    var _qml_id_1_3_2_1_Repeater = createInstance(imports, "Repeater", _qml_id_1_3_2_Row);
    var _qml_id_1_4_Item = createInstance(imports, "Item", root);
    var _qml_id_1_4_1_Text = createInstance(imports, "Text", _qml_id_1_4_Item);
    var row = createInstance(imports, "Row", _qml_id_1_4_Item);
    var _qml_id_1_4_2_1_Repeater = createInstance(imports, "Repeater", row);
    var _qml_id_1_5_NumberAnimation = createInstance(imports, "NumberAnimation", root);
    var _qml_id_1_6_Timer = createInstance(imports, "Timer", root);
    var column = createInstance(imports, "Column", root);
    var dummy = createInstance(imports, "Item", column);
    var _qml_id_1_7_2_Label = createInstance(imports, "Label", column);
    addProperty(_qml_id_1_7_2_Label, "enabled");
    var hoverArea = createInstance(imports, "MouseArea", _qml_id_1_7_2_Label);
    var _qml_id_1_7_3_Label = createInstance(imports, "Label", column);
    var _qml_id_1_7_4_Item = createInstance(imports, "Item", column);
    addProperty(_qml_id_1_7_4_Item, "enabled");
    var _qml_id_1_7_4_1_Image = createInstance(imports, "Image", _qml_id_1_7_4_Item);
    var _qml_id_1_7_4_2_MouseArea = createInstance(imports, "MouseArea", _qml_id_1_7_4_Item);
    var _qml_id_1_7_5_Button = createInstance(imports, "Button", column);
    var _qml_id_1_8_Column = createInstance(imports, "Column", root);
    var _qml_id_1_8_1_Text = createInstance(imports, "Text", _qml_id_1_8_Column);
    var _qml_id_1_8_2_Rectangle = createInstance(imports, "Rectangle", _qml_id_1_8_Column);
    var _qml_id_1_8_2_1_Image = createInstance(imports, "Image", _qml_id_1_8_2_Rectangle);
    var imageArea = createInstance(imports, "MouseArea", _qml_id_1_8_2_1_Image);
    var _qml_id_2_Button = createInstance(imports, "Button", _qml_id_Item);
    with (_qml_id_Item) applyBindings(_qml_id_Item, {
        width: function() { return 800 },
        height: function() { return 600 }
    });
    var root_scope = {};
    addPropertyProxy(root_scope, root, "foo");
    addPropertyProxy(root_scope, root, "buttonColor");
    addPropertyProxy(root_scope, root, "up");
    addPropertyProxy(root_scope, root, "t");
    addPropertyProxy(root_scope, root, "frameCounter");
    addPropertyProxy(root_scope, root, "fps");
    with (root_scope) {
        with (root) applyBindings(root, {
            color: function() { return "#dddedd" },
            width: function() { return parent.width },
            height: function() { return parent.height },
            foo: function() { return 20 },
            buttonColor: function() { return "#59d" },
            up: function() { return true },
            transition: function() { return "all .4s ease-in" },
            t: function() { return 0 },
            frameCounter: function() { return 0 },
            fps: function() { return 0 },
            onTChanged: function() { return ++frameCounter }
        });
        component._instantiateQml = function(parent, scope) {
            var _qml_id_1_1_1_Rectangle = createInstance(imports, "Rectangle", parent);
            addProperty(_qml_id_1_1_1_Rectangle, "unused");
            var _qml_id_1_1_1_1_Text = createInstance(imports, "Text", _qml_id_1_1_1_Rectangle);
            with (scope) {
                var _qml_id_1_1_1_Rectangle_scope = {};
                addPropertyProxy(_qml_id_1_1_1_Rectangle_scope, _qml_id_1_1_1_Rectangle, "unused");
                with (_qml_id_1_1_1_Rectangle_scope) {
                    with (_qml_id_1_1_1_Rectangle) applyBindings(_qml_id_1_1_1_Rectangle, {
                        width: function() { return 80 / 2 },
                        height: function() { return 24 },
                        color: function() { return buttonColor },
                        radius: function() { return 8 }
                    });
                    with (_qml_id_1_1_1_1_Text) applyBindings(_qml_id_1_1_1_1_Text, {
                        x: function() { return 4 },
                        y: function() { return 4 },
                        text: function() { return index }
                    });
                }
            }
            return _qml_id_1_1_1_Rectangle;
        }
        with (_qml_id_1_3_Item) applyBindings(_qml_id_1_3_Item, {
            x: function() { return 220 },
            y: function() { return 20 }
        });
        with (_qml_id_1_3_1_Text) applyBindings(_qml_id_1_3_1_Text, {
            width: function() { return 400 },
            text: function() { return "Row with ListModel Repeater:" }
        });
        with (_qml_id_1_3_2_Row) applyBindings(_qml_id_1_3_2_Row, {
            y: function() { return 28 }
        });
        _qml_id_1_3_2_1_Repeater._instantiateQml = function(parent, scope) {
            var _qml_id_1_3_2_1_1_Text = createInstance(imports, "Text", parent);
            with (scope) {
                with (_qml_id_1_3_2_1_1_Text) applyBindings(_qml_id_1_3_2_1_1_Text, {
                    width: function() { return 80 },
                    height: function() { return 28 },
                    text: function() { return name }
                });
            }
            return _qml_id_1_3_2_1_1_Text;
        }
        with (_qml_id_1_3_2_1_Repeater) applyBindings(_qml_id_1_3_2_1_Repeater, {
            model: function() { return listModel }
        });
        with (_qml_id_1_4_Item) applyBindings(_qml_id_1_4_Item, {
            x: function() { return 520 },
            y: function() { return 20 },
            transition: function() { return "all .8s ease-in-out" },
            transform: function() { return up ? "translate3d(0,0,0)" : "translate3d(0,300px,0)" }
        });
        with (_qml_id_1_4_1_Text) applyBindings(_qml_id_1_4_1_Text, {
            width: function() { return 200 },
            text: function() { return "Nested Row / Column with number Repeaters:" }
        });
        with (row) applyBindings(row, {
            spacing: function() { return 2 },
            y: function() { return 48 }
        });
        _qml_id_1_4_2_1_Repeater._instantiateQml = function(parent, scope) {
            var _qml_id_1_4_2_1_1_Column = createInstance(imports, "Column", parent);
            var _qml_id_1_4_2_1_1_1_Repeater = createInstance(imports, "Repeater", _qml_id_1_4_2_1_1_Column);
            with (scope) {
                with (_qml_id_1_4_2_1_1_Column) applyBindings(_qml_id_1_4_2_1_1_Column, {
                    spacing: function() { return 2 }
                });
                with (_qml_id_1_4_2_1_1_1_Repeater) applyBindings(_qml_id_1_4_2_1_1_1_Repeater, {
                    model: function() { return 8 },
                    delegate: function() { return component }
                });
            }
            return _qml_id_1_4_2_1_1_Column;
        }
        with (_qml_id_1_4_2_1_Repeater) applyBindings(_qml_id_1_4_2_1_Repeater, {
            model: function() { return 4 }
        });
        with (_qml_id_1_5_NumberAnimation) applyBindings(_qml_id_1_5_NumberAnimation, {
            target: function() { return root },
            property: function() { return "t" },
            loops: function() { return -1 },
            running: function() { return true }
        });
        with (_qml_id_1_6_Timer) applyBindings(_qml_id_1_6_Timer, {
            onTriggered: function() {
                fps = frameCounter * 0.5
                frameCounter = 0;
            },
            interval: function() { return 2000 },
            repeat: function() { return true },
            running: function() { return true }
        });
        with (column) applyBindings(column, {
            spacing: function() { return 4 },
            x: function() { return 20 },
            y: function() { return 20 }
        });
        with (dummy) applyBindings(dummy, {
            width: function() { return 140 },
            height: function() { return 24 }
        });
        var _qml_id_1_7_2_Label_scope = {};
        addPropertyProxy(_qml_id_1_7_2_Label_scope, _qml_id_1_7_2_Label, "enabled");
        with (_qml_id_1_7_2_Label_scope) {
            with (_qml_id_1_7_2_Label) applyBindings(_qml_id_1_7_2_Label, {
                width: function() { return 140 },
                height: function() { return 24 },
                color: function() { return buttonColor },
                radius: function() { return 8 },
                enabled: function() { return false },
                labelText: function() { return hoverArea.hovered ? "QML Rocks!" : "Hover me" }
            });
            with (hoverArea) applyBindings(hoverArea, {
                width: function() { return parent.width },
                height: function() { return parent.height },
                hoverEnabled: function() { return true }
            });
        }
        with (_qml_id_1_7_3_Label) applyBindings(_qml_id_1_7_3_Label, {
            y: function() { return 48 },
            labelText: function() { return root.fps + " fps" }
        });
        var _qml_id_1_7_4_Item_scope = {};
        addPropertyProxy(_qml_id_1_7_4_Item_scope, _qml_id_1_7_4_Item, "enabled");
        with (_qml_id_1_7_4_Item_scope) {
            with (_qml_id_1_7_4_Item) applyBindings(_qml_id_1_7_4_Item, {
                y: function() { return 48 + 28 },
                width: function() { return 64 },
                height: function() { return 64 },
                enabled: function() { return true }
            });
            with (_qml_id_1_7_4_1_Image) applyBindings(_qml_id_1_7_4_1_Image, {
                width: function() { return 64 },
                height: function() { return 64 },
                source: function() { return enabled ? "tick.png" : "cross.png" }
            });
            with (_qml_id_1_7_4_2_MouseArea) applyBindings(_qml_id_1_7_4_2_MouseArea, {
                width: function() { return parent.width },
                height: function() { return parent.height },
                onClicked: function() { return enabled = !enabled }
            });
        }
        with (_qml_id_1_7_5_Button) applyBindings(_qml_id_1_7_5_Button, {
            buttonText: function() { return "Animate" },
            onClicked: function() { up = !up; }
        });
        with (_qml_id_1_8_Column) applyBindings(_qml_id_1_8_Column, {
            x: function() { return 40 },
            y: function() { return 220 }
        });
        with (_qml_id_1_8_1_Text) applyBindings(_qml_id_1_8_1_Text, {
            text: function() { return "Lolcat container:" }
        });
        with (_qml_id_1_8_2_Rectangle) applyBindings(_qml_id_1_8_2_Rectangle, {
            borderColor: function() { return "black" },
            borderStyle: function() { return "solid" },
            borderWidth: function() { return 4 },
            radius: function() { return 16 },
            width: function() { return 320 },
            height: function() { return 320 },
            transform: function() { return imageArea.hovered ? "rotate(4deg) scale(1.15)" : "rotate(0deg) scale(1)" },
            transition: function() { return "all .2s ease-in" }
        });
        with (_qml_id_1_8_2_1_Image) applyBindings(_qml_id_1_8_2_1_Image, {
            x: function() { return 4 },
            y: function() { return 4 },
            radius: function() { return 8 },
            width: function() { return parent.width - 8 },
            height: function() { return parent.width - 8 },
            source: function() { return "http://www.lolcats.com/images/u/08/35/lolcatsdotcomaxdjl1t6rivbjr5u.jpg" }
        });
        with (imageArea) applyBindings(imageArea, {
            width: function() { return parent.width },
            height: function() { return parent.height },
            hoverEnabled: function() { return true }
        });
    }
    with (_qml_id_2_Button) applyBindings(_qml_id_2_Button, {
        buttonText: function() { return root.opacity == 0 ? "Fade in" : "Fade out" },
        x: function() { return column.x },
        y: function() { return column.y },
        onClicked: function() {
            if (root.opacity == 0)
                root.opacity = 1;
            else
                root.opacity = 0;
        }
    });
}
