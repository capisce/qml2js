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

    Rectangle {
        x: 20 ; y: 100
        width: 140
        height: 24
        color: buttonColor
        radius: 8

        property var enabled: false

        Text {
            width: 400
            x: 4
            y: 4
            text: enabled ? "QML Rocks!" : "Hello QML2JS"
        }

        MouseArea {
            width: parent.width
            height: parent.height

            onClicked: {
                enabled = !enabled
            }
        }
    }

    NumberAnimation on opacity {
        id: fade
        from: 0
        to: 1
        running: false
    }

    ListModel {
        id: listModel
        ListElement {
            name: "Element A"
        }
        ListElement {
            name: "Element B"
        }
        ListElement {
            name: "Element C"
        }
    }

    Component {
        id: component

        Rectangle {
            property var unused

            width: 40
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

    Item {
        x: 220
        y: 100

        Text { width: 400 ; text: "Column with ListModel Repeater" }

        Column {
            y: 28
            Repeater {
                model: listModel
                Text { height: 28 ; text: name }
            }
        }
    }

    Item {
        x: 520
        y: 100

        Text { width: 400 ; text: "Column with number Repeater" }

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
