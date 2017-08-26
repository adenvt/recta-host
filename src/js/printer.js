import EventEmitter from 'events'
import Adapter from './base/adapter.js'
import Usb from './adapter/usb.js'
import Serial from './adapter/serial.js'
import Network from './adapter/network.js'

const PRINTER_ADAPTER = {
  USB    : Usb,
  SERIAL : Serial,
  NETWORK: Network,
}

export default class Printer extends EventEmitter {
  constructor (adapter, options) {
    super()

    if (adapter instanceof Adapter)
      this.adapter = adapter
    else
      this.adapter = new PRINTER_ADAPTER[adapter.toUpperCase()](options)

    this.adapter.on('open', () => {
      this.emit('open')
    })
    this.adapter.on('close', () => {
      this.emit('close')
    })
    this.adapter.on('error', (e) => {
      this.emit('error', e)
    })
  }

  get isOpen () {
    return this.adapter.isOpen
  }

  print (data) {
    this.adapter.write(data)
  }

  open () {
    return this.adapter.open()
  }

  close () {
    return this.adapter.close()
  }
}
