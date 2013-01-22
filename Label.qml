Rectangle {
    property var labelColor: "#38c"
    property var labelText: ""
    property var selectable: true
    width: 80
    height: 24
    color: labelColor
    radius: 8

    Text {
        width: 200
        height: 24
        x: 4
        y: 4
        text: labelText
        selectable: parent.selectable
    }
}
