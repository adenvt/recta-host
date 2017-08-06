import { Socket } from 'net'
import Adapter from '../base/adapter.js'

export default class Network extends Adapter {
  constructor (option = {}) {
    super()

    this.option = option
    this.device = new Socket()
    this.device.on('connect', () => {
      this.isOpen = true

      this.emit('open')
    })
    this.device.on('close', () => {
      this.isOpen = false

      this.emit('close')
    })
    this.device.on('error', (e) => {
      if (this.isOpen)
        this.emit('error', e)
    })
  }

  open () {
    return new Promise((resolve, reject) => {
      if (this.isOpen)
        return resolve()

      this.device.once('error', (e) => {
        return reject(e)
      }).connect(this.option.port, this.option.address, () => {
        return resolve()
      })
    })
  }

  close () {
    return new Promise((resolve) => {
      if (!this.isOpen)
        return resolve()

      this.device.once('close', () => {
        return resolve()
      }).destroy()
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
