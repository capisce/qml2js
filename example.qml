/* example.qml */
Rectangle {
    id: root
    color: "olive"

    width: 800
    height: 800

    property var foo: 20

    MouseArea {
        width: 800
        height: 800

        onClicked: {
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
    }

    Image {
        id: image
        x: 10
        y: 200
        property var enabled: true
        source: enabled ? "tick.png" : "cross.png"

        MouseArea {
            width: image.width
            height: image.height
            onClicked: enabled = !enabled
        }
    }

    Rectangle {
        id: rect
        color: "green"

        width: 40
        height: 40

        NumberAnimation on x {
            from: 0
            to: root.width - rect.width
            duration: 4000
            running: true
            loops: -1
        }

        Rectangle {
            id: inner
            color: "red"

            width: foo
            height: 20
        }
    }

    property var buttonColor: "#37f"

    Label {
        x: 20 ; y: 100
        width: 140
        height: 24
        color: buttonColor
        radius: 8

        property var enabled: false
        labelText: hoverArea.hovered ? "QML Rocks!" : "Hello QML2JS"

        MouseArea {
            id: hoverArea
            width: parent.width
            height: parent.height
            hoverEnabled: true
        }
    }

    NumberAnimation on opacity {
        id: fade
        from: 0
        to: 1
        running: false
    }

    Component {
        id: component

        Rectangle {
            property var unused

            width: 80 / 2
            height: 24
            color: buttonColor
            radius: 8

            Text {
                x: 4
                y: 4
                text: index
            }
        }
    }

    /* list model repeater */

    SimpleModel { id: listModel }

    Item {
        x: 220
        y: 100

        Text { width: 400 ; text: "Row with ListModel Repeater" }

        Row {
            y: 28
            Repeater {
                model: listModel
                Text { width: 80 ; height: 28 ; text: name }
            }
        }
    }

    /*
     * nested repeaters
     */

    Item {
        x: 520
        y: 100
        Text { width: 200 ; text: "Nested Row / Column with number Repeaters" }

        Row {
            y: 20
            Repeater {
                model: 2
                Column {
                    y: 28
                    spacing: 2
                    Repeater {
                        model: 8
                        delegate: component
                    }
                }
            }
        }
    }

    property var t: 0
    NumberAnimation on t {
        loops: -1
        running: true
    }

    property var frameCounter: 0
    property var fps: 0

    onTChanged: ++frameCounter

    Text {
        x: 4
        y: 400
        text: root.fps + " fps"
    }

    Timer {
        onTriggered: {
            fps = frameCounter * 0.5
            frameCounter = 0;
        }

        interval: 2000
        repeat: true
        running: true
    }
}
