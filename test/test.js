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
  this.timeout(120000)

  beforeEach(() => {
    this.app = new Application({
      path        : path.join(__dirname, APP_PATH),
      args        : ['--testing'],
      startTimeout: 30000,
    })
    return this.app.start()
  })

  afterEach(() => {
    if (this.app && this.app.isRunning()) {
      return this.app.client.getMainProcessLogs().then((logs) => {
        if (logs.length)
          console.log(logs)

        return this.app.stop()
      })
    }
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

  it('Main component must be shown', () => {
    return new Promise((resolve, reject) => {
      this.app.client.waitUntilWindowLoaded(30000).then(() => {
        return this.app.client.waitUntilTextExists('#app-name', 'Recta Host', 30000)
      }).then(() => {
        return resolve()
      }).catch((e) => {
        return reject(e)
      })
    })
  })
})
