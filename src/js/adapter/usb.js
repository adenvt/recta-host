import OS from 'os'
import LibUSB from 'usb'
import Adapter from '../base/adapter.js'

const IFACE_CLASS = {
  AUDIO  : 0x01,
  HID    : 0x03,
  PRINTER: 0x07,
  HUB    : 0x09,
}

export default class USB extends Adapter {
  constructor (option = {}) {
    super()
    this.endpoint = null
    this.option = option

    if (option.vid && option.pid)
      this.device = LibUSB.findByIds(option.vid, option.pid)
    else {
      const devices = USB.findPrinter()

      if (devices && devices.length)
        this.device = devices[0]
    }

    if (!this.device)
      throw new Error('Cannot find printer')

    LibUSB.on('attach', (device) => {
      if (this.device)
        return

      const isPrinter = device.configDescriptor.interfaces.filter((iface) => {
        return iface.filter((conf) => {
          return conf.bInterfaceClass === IFACE_CLASS.PRINTER
        }).length
      }).length > 0

      if (isPrinter) {
        this.device = device
        if (this.option.autoOpen)
          this.open()
      }
    })

    LibUSB.on('detach', (device) => {
      if (device === this.device) {
        this.isOpen = false
        this.device = null
        this.endpoint = null

        this.emit('close')
      }
    })
  }

  static findPrinter () {
    return LibUSB.getDeviceList().filter((device) => {
      try {
        return device.configDescriptor.interfaces.filter((iface) => {
          return iface.filter((conf) => {
            return conf.bInterfaceClass === IFACE_CLASS.PRINTER
          }).length
        }).length
      } catch (e) {
        return false
      }
    })
  }

  open () {
    return new Promise((resolve, reject) => {
      if (this.isOpen)
        return resolve()

      this.device.open()

      for (const iface of this.device.interfaces) {
        // http://libusb.sourceforge.net/api-1.0/group__dev.html#gab14d11ed6eac7519bb94795659d2c971
        // libusb_kernel_driver_active / libusb_attach_kernel_driver / libusb_detach_kernel_driver : "This functionality is not available on Windows
        if (OS.platform() !== 'win32') {
          if (iface.isKernelDriverActive()) {
            try {
              iface.detachKernelDriver()
            } catch (e) {
              return reject(new Error(`Could not detach kernel driver: '${e.message}'`))
            }
          }
        }

        iface.claim() // must be called before using any endpoints of this interface.

        for (const endpoint of iface.endpoints) {
          if (endpoint.direction === 'out') {
            this.endpoint = endpoint

            break
          }
        }

        if (this.endpoint)
          break
      }

      if (!this.endpoint)
        return reject(new Error('Can not find endpoint from printer'))

      this.isOpen = true
      this.emit('open')

      return resolve()
    })
  }

  close () {
    return new Promise((resolve) => {
      if (!this.isOpen)
        return resolve()

      this.device.close()
      this.isOpen = false
      this.endpoint = null
      this.emit('close')

      return resolve()
    })
  }

  write (buffer) {
    try {
      if (!this.isOpen || !this.endpoint)
        throw new Error('Adapter not opened')

      this.endpoint.transfer(buffer)
    } catch (e) {
      this.emit('error', e)
    }
  }
}
