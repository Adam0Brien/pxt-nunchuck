//% block="Nunchuk" color=#30C3EC
//% subcategory="Nunchuk"
namespace Nunchuk {

    const NUNCHUK_ADDRESS = 0x52
    const JOY_X_ZERO = 127
    const JOY_Y_ZERO = 128
    const ACCEL_X_ZERO = 512
    const ACCEL_Y_ZERO = 512
    const ACCEL_Z_ZERO = 512

    let data: number[] = [0, 0, 0, 0, 0, 0]

    //% block="initialize nunchuk"
    //% group="1. Setup"
    //% subcategory="Nunchuk"
    //% color=#30C3EC
    export function init(): void {
        pins.i2cWriteBuffer(NUNCHUK_ADDRESS, pins.createBufferFromArray([0xF0, 0x55]), false)
        basic.pause(10)
        pins.i2cWriteBuffer(NUNCHUK_ADDRESS, pins.createBufferFromArray([0xFB, 0x00]), false)
        basic.pause(10)
    }

    function read(): boolean {
        pins.i2cWriteNumber(NUNCHUK_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        basic.pause(2)
        const buf = pins.i2cReadBuffer(NUNCHUK_ADDRESS, 6, false)
        if (buf.length != 6) return false
        for (let i = 0; i < 6; i++) {
            data[i] = buf.getUint8(i)
        }
        return true
    }

    //% block="joystick x"
    //% group="2. Joystick"
    //% subcategory="Nunchuk"
    //% color=#30C3EC
    export function joystickX(): number {
        read()
        return data[0] - JOY_X_ZERO
    }

    //% block="joystick y"
    //% group="2. Joystick"
    //% subcategory="Nunchuk"
    //% color=#30C3EC
    export function joystickY(): number {
        read()
        return data[1] - JOY_Y_ZERO
    }

    //% block="joystick angle"
    //% group="2. Joystick"
    //% subcategory="Nunchuk"
    //% color=#30C3EC
    export function joystickAngle(): number {
        return Math.atan2(joystickY(), joystickX())
    }

    function rawAccelX(): number {
        return (data[2] << 2) | ((data[5] >> 2) & 0x03)
    }

    function rawAccelY(): number {
        return (data[3] << 2) | ((data[5] >> 4) & 0x03)
    }

    function rawAccelZ(): number {
        return (data[4] << 2) | ((data[5] >> 6) & 0x03)
    }

    //% block="accel x"
    //% group="3. Accelerometer"
    //% subcategory="Nunchuk"
    //% color=#30C3EC
    export function accelX(): number {
        read()
        return rawAccelX() - ACCEL_X_ZERO
    }

    //% block="accel y"
    //% group="3. Accelerometer"
    //% subcategory="Nunchuk"
    //% color=#30C3EC
    export function accelY(): number {
        read()
        return rawAccelY() - ACCEL_Y_ZERO
    }

    //% block="accel z"
    //% group="3. Accelerometer"
    //% subcategory="Nunchuk"
    //% color=#30C3EC
    export function accelZ(): number {
        read()
        return rawAccelZ() - ACCEL_Z_ZERO
    }

    //% block="pitch angle"
    //% group="4. Orientation"
    //% subcategory="Nunchuk"
    //% color=#30C3EC
    export function pitch(): number {
        return Math.atan2(accelY(), accelZ())
    }

    //% block="roll angle"
    //% group="4. Orientation"
    //% subcategory="Nunchuk"
    //% color=#30C3EC
    export function roll(): number {
        return Math.atan2(accelX(), accelZ())
    }

    //% block="button Z pressed"
    //% group="5. Buttons"
    //% subcategory="Nunchuk"
    //% color=#30C3EC
    export function buttonZ(): boolean {
        read()
        return ((~data[5]) & 0x01) != 0
    }

    //% block="button C pressed"
    //% group="5. Buttons"
    //% subcategory="Nunchuk"
    //% color=#30C3EC
    export function buttonC(): boolean {
        read()
        return ((~data[5]) & 0x02) != 0
    }

    //% block="print debug data"
    //% group="Debug"
    //% subcategory="Debug"
    //% color=#FFA500
    export function print(): void {
        read()
        serial.writeLine("Joy X=" + joystickX() + " Y=" + joystickY())
        serial.writeLine("Acc X=" + accelX() + " Y=" + accelY() + " Z=" + accelZ())
        serial.writeLine("Buttons: Z=" + buttonZ() + " C=" + buttonC())
    }
}
