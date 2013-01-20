Rectangle {
    id: root
    color: "olive"

    width: 800
    height: 800

    Rectangle {
        color: "green"

        width: 40
        height: 40

        NumberAnimation on x {
            from: 0
            to: 800
            duration: 10000
            running: true
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
}
