/* example.qml */
Item {
    width: 800
    height: 600

    Rectangle {
        id: root
        color: "#dddedd"

        width: parent.width
        height: parent.height

        property var foo: 20
        property var buttonColor: "#59d"

        property var up: true

        transition: "all .4s ease-in"

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
            y: 20

            Text { width: 400 ; text: "Row with ListModel Repeater:" }

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
            y: 20

            transition: "all .8s ease-in-out"
            transform: up ? "translate3d(0,0,0)" : "translate3d(0,300px,0)"

            Text { width: 200 ; text: "Nested Row / Column with number Repeaters:" }

            Row {
                id: row
                spacing: 2
                y: 48
                Repeater {
                    model: 4
                    Column {
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

        Timer {
            onTriggered: {
                fps = frameCounter * 0.5
                frameCounter = 0;
            }

            interval: 2000
            repeat: true
            running: true
        }

        Column {
            id: column

            spacing: 4
            x: 20 ; y: 20

            Item {
                id: dummy
                width: 140
                height: 24
            }

            Label {
                width: 140
                height: 24
                color: buttonColor
                radius: 8

                property var enabled: false
                labelText: hoverArea.hovered ? "QML Rocks!" : "Hover me"

                MouseArea {
                    id: hoverArea
                    width: parent.width
                    height: parent.height
                    hoverEnabled: true
                }
            }

            Label {
                y: 48
                labelText: root.fps + " fps"
            }

            Item {
                y: 48 + 28
                width: 64
                height: 64

                property var enabled: true

                Image {
                    width: 64
                    height: 64
                    source: enabled ? "tick.png" : "cross.png"
                }

                MouseArea {
                    width: parent.width
                    height: parent.height
                    onClicked: enabled = !enabled
                }
            }

            Button {
                buttonText: "Animate"
                onClicked: { up = !up; }
            }
        }

        Column {
            x: 40
            y: 220
            Text { text: "Lolcat container:" }

            Rectangle {
                borderColor: "black"
                borderStyle: "solid"
                borderWidth: 4
                radius: 16
                width: 320
                height: 320

                Image {
                    x: 4
                    y: 4
                    radius: 8
                    width: parent.width - 8
                    height: parent.width - 8
                    source: "http://www.lolcats.com/images/u/08/35/lolcatsdotcomaxdjl1t6rivbjr5u.jpg"

                    MouseArea {
                        id: imageArea
                        width: parent.width
                        height: parent.height
                        hoverEnabled: true
                    }
                }

                transform: imageArea.hovered ? "rotate(4deg) scale(1.15)" : "rotate(0deg) scale(1)"
                transition: "all .2s ease-in"
            }
        }
    }

    Button {
        buttonText: root.opacity == 0 ? "Fade in" : "Fade out"
        x: column.x
        y: column.y

        onClicked: {
            if (root.opacity == 0)
                root.opacity = 1;
            else
                root.opacity = 0;
        }
    }
}
