MouseArea {
    property var buttonText: ""
    width: 80
    height: 24

    Label {
        width: parent.width
        height: parent.height
        id: label
        labelText: buttonText
    }
}
