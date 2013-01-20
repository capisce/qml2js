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

    Text {
        x: 20 ; y: 100
        text: "Hello QML2JS"
    }

    NumberAnimation on opacity {
        id: fade
        from: 0
        to: 1
        running: false
    }
}
