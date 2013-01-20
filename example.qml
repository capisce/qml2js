Rectangle {
    id: "root"
    color: "olive"

    width: 800
    height: 800

    Rectangle {
        color: "green"

        width: 40
        height: 40

        Rectangle {
            id: "inner"
            color: "red"

            width: 20
            height: 20

            property var x: 0
            property var y: x > 25 ? 100 : 0
            
            NumberAnimation on x {
                from: 0
                to: 50
                duration: 10000
            }

            Behavior on y { NumberAnimation { duration: 5000 } }

            onXChanged: {
                console.log('x changed: ' + x)
            }

            onYChanged: {
                console.log('y changed: ' + y)
            }
        }
    }
}
