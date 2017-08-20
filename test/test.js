const path = require('path')
const assert = require('assert')
const Application = require('spectron').Application

const ARCH = process.env.BUILD_ARCH || process.arch

describe('Application launch', function () {
  this.timeout(10000)

  before(function () {
    this.app = new Application({
      path: path.join(__dirname, `../out/recta-host-linux-${ARCH}/recta-host`),
      args: ['--testing'],
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
