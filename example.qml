Rectangle {
    id: root
    color: "olive"

    width: 800
    height: 800

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

            width: 20
            height: 20

            property var foo: 0
            property var bar: 0 > 25 ? 100 : 0
            
            Behavior on bar { NumberAnimation { duration: 5000 } }

            onXChanged: {
                console.log('x changed: ' + 0)
            }

            onYChanged: {
                console.log('y changed: ' + 0)
            }
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
}
