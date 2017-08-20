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

  before(function () {
    this.app = new Application({
      path        : path.join(__dirname, APP_PATH),
      args        : ['--testing'],
      startTimeout: 30000,
    })
    return this.app.start()
  })

  after(function () {
    if (this.app && this.app.isRunning())
      return this.app.stop()
  })

  it('Windows must be shown', function () {
    return this.app.client.getWindowCount().then(function (count) {
      assert.equal(count, 1)
    })
  })

  it('Main component must be shown', function () {
    return this.app.client.waitUntilTextExists('#app-name', 'Recta Host', 3000).then(function () {
      assert.ok(1)
    }).catch(function (e) {
      assert.fail(e)
    })
  })
})
