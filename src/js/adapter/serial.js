import SerialPort from 'serialport'
import Adapter from '../base/adapter.js'

export default class Serial extends Adapter {
  constructor (option = {}) {
    super()

    this.device = new SerialPort(option.comport, {
      baudRate: option.baudrate,
      autoOpen: false,
    })
    this.device.on('open', () => {
      this.isOpen = true

      this.emit('open')
    })
    this.device.on('close', () => {
      this.isOpen = false

      this.emit('close')
    })
    this.device.on('error', (e) => {
      this.emit('error', e)
    })
  }

  open () {
    return new Promise((resolve, reject) => {
      if (this.isOpen)
        return resolve()

      this.device.open((error) => {
        if (error)
          return reject(error)

        return resolve()
      })
    })
  }

  close () {
    return new Promise((resolve, reject) => {
      if (!this.isOpen)
        return resolve()

      this.device.close((error) => {
        if (error)
          return reject(error)

        return resolve()
      })
    })
  }

  write (buffer) {
    try {
      this.device.write(buffer)
    } catch (e) {
      this.emit('error', e)
    }
  }
}
