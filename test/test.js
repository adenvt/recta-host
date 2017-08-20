const path = require('path')
const assert = require('assert')
const Application = require('spectron').Application

const PLATFORM = process.platform
const ARCH = process.env.BUILD_ARCH || process.arch

let APP_PATH = `../out/recta-host-${PLATFORM}-${ARCH}/recta-host`

if (PLATFORM === 'win32')
  APP_PATH += '.exe'

describe('Application launch', function () {
  this.timeout(120000)

  before(() => {
    this.app = new Application({
      path        : path.join(__dirname, APP_PATH),
      args        : ['--testing'],
      startTimeout: 30000,
    })
    return this.app.start()
  })

  after(() => {
    if (this.app && this.app.isRunning())
      return this.app.stop()
  })

  it('Windows must be shown', () => {
    return this.app.client.getWindowCount().then(function (count) {
      assert.equal(count, 1)
    })
  })

  it('Main component must be shown', () => {
    return new Promise((resolve) => {
      this.app.client.waitUntilWindowLoaded(30000).then(() => {
        return this.app.client.waitUntilTextExists('#app-name', 'Recta Host', 30000)
      }).then(() => {
        return resolve()
      }).catch(function (e) {
        return reject(e)
      })
    })
  })
})
