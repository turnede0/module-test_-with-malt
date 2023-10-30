input.onButtonPressed(Button.B, function () {
    basic.showIcon(IconNames.House)
    serial.setRxBufferSize(1024)
    serial.setWriteLinePadding(0)
    serial.writeLine("AT+SSID=AndroidAP66C3")
    serial.writeLine("AT+PW=mlnv5090")
    serial.writeLine("AT+PID=16001084")
    serial.writeLine("AT+DID=161215289")
    serial.writeLine("AT+DPW=CM")
    serial.writeLine("AT+CONFIG=1")
})
// Just for visualization on the serial data, have no actual impact to the programing
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    basic.showIcon(IconNames.Sword)
    serial.redirect(
    SerialPin.USB_TX,
    SerialPin.P8,
    BaudRate.BaudRate9600
    )
    serial.writeLine(serial.readUntil(serial.delimiters(Delimiters.NewLine)))
})
let humid = 0
let temperture = 0
basic.showIcon(IconNames.Asleep)
basic.pause(5000)
basic.showIcon(IconNames.Happy)
serial.setRxBufferSize(1024)
serial.setWriteLinePadding(0)
serial.redirect(
SerialPin.P12,
SerialPin.P8,
BaudRate.BaudRate9600
)
serial.writeLine("AT+CONN=5")
serial.writeLine("AT+MQTTCONN=1")
serial.redirectToUSB()
for (let index = 0; index < 5; index++) {
    dht11_dht22.queryData(
    DHTtype.DHT11,
    DigitalPin.P14,
    true,
    true,
    true
    )
    if (dht11_dht22.readDataSuccessful()) {
        temperture = dht11_dht22.readData(dataType.temperature)
        humid = dht11_dht22.readData(dataType.humidity)
        break;
    } else {
        temperture = 25
        humid = 30
    }
}
serial.redirectToUSB()
serial.writeValue("Temp", temperture)
serial.writeValue("Humid", humid)
let Light = Math.map(pins.analogReadPin(AnalogPin.P0), 0, 1024, 1024, 0)
serial.writeValue("Light", Light)
serial.redirect(
SerialPin.P12,
SerialPin.P8,
BaudRate.BaudRate9600
)
serial.writeLine("AT+SEND=" + "Temp" + "," + temperture)
serial.writeLine("AT+SEND=" + "Humid" + "," + humid)
serial.writeLine("AT+SEND=" + "Noise" + "," + pins.analogReadPin(AnalogPin.P0))
serial.writeLine("AT+SEND=" + "Light" + "," + Light)
basic.showIcon(IconNames.Yes)
basic.pause(5000)
control.reset()
