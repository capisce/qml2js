MouseArea {
    property var buttonText: ""
    width: 120
    height: 24

    hoverEnabled: true

    Label {
        id: label
        labelColor: parent.hovered ? "#38c" : "#59d"
        width: parent.width
        height: parent.height
        labelText: buttonText
    }
}
