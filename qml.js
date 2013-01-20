function initQml() {
    var imports = [ basicelements ];
    var root = createInstance(imports, "Rectangle");
    addProperty(root, "foo");
    addProperty(root, "buttonColor");
    var _qml_id_1_MouseArea = createInstance(imports, "MouseArea", root);
    var image = createInstance(imports, "Image", root);
    addProperty(image, "enabled");
    var _qml_id_2_1_MouseArea = createInstance(imports, "MouseArea", image);
    var rect = createInstance(imports, "Rectangle", root);
    var _qml_id_3_1_NumberAnimation = createInstance(imports, "NumberAnimation", rect);
    var inner = createInstance(imports, "Rectangle", rect);
    var _qml_id_4_Rectangle = createInstance(imports, "Rectangle", root);
    addProperty(_qml_id_4_Rectangle, "enabled");
    var _qml_id_4_1_Text = createInstance(imports, "Text", _qml_id_4_Rectangle);
    var _qml_id_4_2_MouseArea = createInstance(imports, "MouseArea", _qml_id_4_Rectangle);
    var fade = createInstance(imports, "NumberAnimation", root);
    var listModel = createInstance(imports, "ListModel", root);
    var _qml_id_6_1_ListElement = createInstance(imports, "ListElement", listModel);
    addProperty(_qml_id_6_1_ListElement, "name");
    var _qml_id_6_2_ListElement = createInstance(imports, "ListElement", listModel);
    addProperty(_qml_id_6_2_ListElement, "name");
    var _qml_id_6_3_ListElement = createInstance(imports, "ListElement", listModel);
    addProperty(_qml_id_6_3_ListElement, "name");
    var component = createInstance(imports, "Component", root);
    var _qml_id_8_Text = createInstance(imports, "Text", root);
    var _qml_id_9_Repeater = createInstance(imports, "Repeater", root);
    var _qml_id_10_Text = createInstance(imports, "Text", root);
    var _qml_id_11_Repeater = createInstance(imports, "Repeater", root);
    var root_scope = {};
    addPropertyProxy(root_scope, root, "foo");
    addPropertyProxy(root_scope, root, "buttonColor");
    with (root_scope) {
        applyBindings(root, {
            color: function() { return "olive" },
            width: function() { return 800 },
            height: function() { return 800 },
            foo: function() { return 20 },
            buttonColor: function() { return "#37f" }
        });
        applyBindings(_qml_id_1_MouseArea, {
            width: function() { return 800 },
            height: function() { return 800 },
            onClicked: function() {
            if (fade.running)
                return;
            if (fade.to === 0) {
                fade.to = 1;
                fade.from = 0;
            } else {
                fade.to = 0;
                fade.from = 1;
            }
            fade.running = true;
        }
        });
        var image_scope = {};
        addPropertyProxy(image_scope, image, "enabled");
        with (image_scope) {
            applyBindings(image, {
                x: function() { return 10 },
                y: function() { return 200 },
                enabled: function() { return true },
                source: function() { return enabled ? "tick.png" : "cross.png" }
            });
            applyBindings(_qml_id_2_1_MouseArea, {
                width: function() { return image.width },
                height: function() { return image.height },
                onClicked: function() { return enabled = !enabled }
            });
        }
        applyBindings(rect, {
            color: function() { return "green" },
            width: function() { return 40 },
            height: function() { return 40 }
        });
        applyBindings(_qml_id_3_1_NumberAnimation, {
            target: function() { return rect },
            property: function() { return "x" },
            from: function() { return 0 },
            to: function() { return root.width - rect.width },
            duration: function() { return 4000 },
            running: function() { return true },
            loops: function() { return -1 }
        });
        applyBindings(inner, {
            color: function() { return "red" },
            width: function() { return foo },
            height: function() { return 20 }
        });
        var _qml_id_4_Rectangle_scope = {};
        addPropertyProxy(_qml_id_4_Rectangle_scope, _qml_id_4_Rectangle, "enabled");
        with (_qml_id_4_Rectangle_scope) {
            applyBindings(_qml_id_4_Rectangle, {
                x: function() { return 20 },
                y: function() { return 100 },
                width: function() { return 140 },
                height: function() { return 24 },
                color: function() { return buttonColor },
                radius: function() { return 8 },
                enabled: function() { return false }
            });
            applyBindings(_qml_id_4_1_Text, {
                width: function() { return 400 },
                x: function() { return 4 },
                y: function() { return 4 },
                text: function() { return enabled ? "QML Rocks!" : "Hello QML2JS" }
            });
            applyBindings(_qml_id_4_2_MouseArea, {
                width: function() { return parent.width },
                height: function() { return parent.height },
                onClicked: function() {
                enabled = !enabled
            }
            });
        }
        applyBindings(fade, {
            target: function() { return root },
            property: function() { return "opacity" },
            from: function() { return 0 },
            to: function() { return 1 },
            running: function() { return false }
        });
        var _qml_id_6_1_ListElement_scope = {};
        addPropertyProxy(_qml_id_6_1_ListElement_scope, _qml_id_6_1_ListElement, "name");
        with (_qml_id_6_1_ListElement_scope) {
            applyBindings(_qml_id_6_1_ListElement, {
                name: function() { return "Element A" }
            });
        }
        var _qml_id_6_2_ListElement_scope = {};
        addPropertyProxy(_qml_id_6_2_ListElement_scope, _qml_id_6_2_ListElement, "name");
        with (_qml_id_6_2_ListElement_scope) {
            applyBindings(_qml_id_6_2_ListElement, {
                name: function() { return "Element B" }
            });
        }
        var _qml_id_6_3_ListElement_scope = {};
        addPropertyProxy(_qml_id_6_3_ListElement_scope, _qml_id_6_3_ListElement, "name");
        with (_qml_id_6_3_ListElement_scope) {
            applyBindings(_qml_id_6_3_ListElement, {
                name: function() { return "Element C" }
            });
        }
        component._instantiateQml = function(parent, scope) {
            var _qml_id_7_1_Rectangle = createInstance(imports, "Rectangle", parent);
            addProperty(_qml_id_7_1_Rectangle, "unused");
            var _qml_id_7_1_1_Text = createInstance(imports, "Text", _qml_id_7_1_Rectangle);
            with (scope) {
                var _qml_id_7_1_Rectangle_scope = {};
                addPropertyProxy(_qml_id_7_1_Rectangle_scope, _qml_id_7_1_Rectangle, "unused");
                with (_qml_id_7_1_Rectangle_scope) {
                    applyBindings(_qml_id_7_1_Rectangle, {
                        x: function() { return 420 },
                        y: function() { return 100 + index * 28 },
                        width: function() { return 40 },
                        height: function() { return 24 },
                        color: function() { return buttonColor },
                        radius: function() { return 8 }
                    });
                    applyBindings(_qml_id_7_1_1_Text, {
                        x: function() { return 4 },
                        y: function() { return 4 },
                        text: function() { return index }
                    });
                }
            }
            return _qml_id_7_1_Rectangle;
        }
        applyBindings(_qml_id_8_Text, {
            width: function() { return 400 },
            x: function() { return 220 },
            y: function() { return 100 - 28 },
            text: function() { return "Repeater with ListModel" }
        });
        _qml_id_9_Repeater._instantiateQml = function(parent, scope) {
            var _qml_id_9_1_Text = createInstance(imports, "Text", parent);
            with (scope) {
                applyBindings(_qml_id_9_1_Text, {
                    x: function() { return 220 },
                    y: function() { return 100 + index * 28 },
                    text: function() { return name }
                });
            }
            return _qml_id_9_1_Text;
        }
        applyBindings(_qml_id_9_Repeater, {
            model: function() { return listModel }
        });
        applyBindings(_qml_id_10_Text, {
            width: function() { return 400 },
            x: function() { return 420 },
            y: function() { return 100 - 28 },
            text: function() { return "Repeater with number" }
        });
        applyBindings(_qml_id_11_Repeater, {
            model: function() { return 8 },
            delegate: function() { return component }
        });
    }
}