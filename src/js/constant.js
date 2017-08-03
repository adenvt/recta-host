import Config from 'electron-config'

export const CFG = new Config({
  name: 'recta',
  defaults: {
    printer: {
      adapter: 'usb',
      option: {}
    },
    app: {
      startup: false,
      port: 1811,
      key: ''
    }
  }
})

export const PRINT_TEST =`
*** PRINTER TEST ***
*** RECTA PRINT ***
*** --------------- ***
`
