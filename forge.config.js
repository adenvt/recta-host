const path = require('path')
const { version } = require('./package.json')
const { platform, arch } = process

module.exports = {
  make_targets: {
    win32: [
      'squirrel',
      'zip',
    ],
    darwin: [
      'zip',
    ],
    linux: [
      'deb',
      'rpm',
      'zip',
    ],
  },
  electronPackagerConfig: {
    asar  : true,
    ignore: [
      '^/\\.',
      '^/[\\w\\.]+\\.log$',
      '^/yarn',
      '^/node_modules/uws',
      '^/node_modules/\\.cache',
      '^/test',
      '^/appveyor\\.yml',
    ],
    appCopyright : 'Copyright (C) 2017 Ade Novid.',
    icon         : 'src/img/icons/win/icon.ico',
    win32metadata: {
      CompanyName     : 'Recta',
      FileDescription : 'Recta Host',
      InternalName    : 'Recta Host',
      ProductName     : 'Recta Host',
      OriginalFilename: 'recta-host.exe',
    },
    download: {
      cache: 'node_modules/.cache/electron',
    },
  },
  electronWinstallerConfig: {
    name      : `recta-host-${platform}-${arch}`,
    iconUrl   : 'https://raw.githubusercontent.com/adenvt/recta-host/develop/src/img/icons/win/icon.ico',
    setupIcon : 'src/img/icons/win/icon.ico',
    setupExe  : `recta-host-${platform}-${arch}-${version}-setup.exe`,
    loadingGif: 'src/img/animation/loading.gif',
  },
  electronInstallerDebian: {
    icon: {
      '48x48'  : 'src/img/icons/png/48x48.png',
      '64x64'  : 'src/img/icons/png/64x64.png',
      '128x128': 'src/img/icons/png/128x128.png',
      '256x256': 'src/img/icons/png/256x256.png',
    },
    rename (dest, src) {
      return path.join(dest, `recta-host-${platform}-${arch}-${version}.deb`)
    },
  },
  electronInstallerRedhat: {
    icon: {
      '48x48'  : 'src/img/icons/png/48x48.png',
      '64x64'  : 'src/img/icons/png/64x64.png',
      '128x128': 'src/img/icons/png/128x128.png',
      '256x256': 'src/img/icons/png/256x256.png',
    },
    rename (dest, src) {
      return path.join(dest, `recta-host-${platform}-${arch}-${version}.rpm`)
    },
  },
  github_repository: {
    owner: 'adenvt',
    name : 'recta-host',
  },
  windowsStoreConfig: {
    packageName: '',
    name       : 'rectahost',
  },
}
