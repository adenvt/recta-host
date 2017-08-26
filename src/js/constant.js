import _ from 'lodash'
import AutoLaunch from 'auto-launch'
import Config from 'electron-config'
import { version } from '../../package.json'

export const CFG = new Config({
  name    : 'recta',
  defaults: {
    printer: {
      adapter: 'usb',
      option : {},
    },
    app: {
      port: 1811,
      key : _.random(1000000000, 9999999999).toString(),
    },
  },
})

export const AUTOLUNCHER = new AutoLaunch({
  name    : 'Recta',
  isHidden: true,
})

export const ICON = (() => {
  const icons = {
    linux: '../img/icons/png/64x64.png',
    win32: '../img/icons/win/icon.ico',
  }

  return icons[process.platform]
})()

export const PRINT_TEST =
`\x1b\x40\x1b\x61\x01
***   PRINTER TEST  ***
***   RECTA PRINT   ***
***     v ${version}     ***
*** --------------- ***
\x1b\x61\x00LEFT ALIGN
\x1b\x61\x01CENTER ALIGN
\x1b\x61\x02RIGHT ALIGN
\x1b\x61\x00\x1b\x2d\x01UNDERLINE
\x1b\x2d\x02UNDERLINE DOUBLE
\x1b\x2d\x00\x1b\x45\x01EMPHASIZED
\x1b\x45\x00\x1b\x47\x01DOUBLE STRIKE
\x1b\x47\x00\x1b\x61\x01
\x1d\x6b\x41\x0c123456789012\n\n`
