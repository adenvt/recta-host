const path = require('path')
const assert = require('assert')
const console = require('mocha-logger')
const Application = require('spectron').Application

const PLATFORM = process.platform
const ARCH = process.env.BUILD_ARCH || process.arch

let APP_PATH = `../out/recta-host-${PLATFORM}-${ARCH}/recta-host`

if (PLATFORM === 'win32')
  APP_PATH += '.exe'

describe('Application launch', function () {
  this.timeout(60000)

  before(() => {
    this.app = new Application({
      path        : path.join(__dirname, APP_PATH),
      args        : ['--testing', '--debug'],
      startTimeout: 30000,
    })
    return this.app.start().then(() => {
      return this.app.client.waitUntilWindowLoaded(30000)
    })
  })

  after(() => {
    return this.app.client.getMainProcessLogs().then((logs) => {
      if (logs.length) {
        logs.forEach((log) => {
          if (log.trim())
            console.log(log.trim())
        })
      }

      if (this.app && this.app.isRunning())
        return this.app.stop()
    })
  })

  it('Windows must be shown', () => {
    return this.app.client.getWindowCount().then((count) => {
      assert.equal(count, 1)
    })
  })

  it('Windows must be visible', () => {
    return this.app.browserWindow.isVisible().then((visible) => {
      assert.equal(visible, true)
    })
  })

  // Issue with LibUsb init on travis
  // https://github.com/tessel/node-usb/issues/194
  if (!process.env.TRAVIS) {
    it('Main component must be shown', () => {
      return this.app.client.waitUntilTextExists('#app-name', 'Recta Host', 30000)
    })
  }
})
