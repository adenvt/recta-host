# Recta Host

> Direct printing from Browser

[![Build Status](https://travis-ci.org/adenvt/recta-host.svg?branch=master)](https://travis-ci.org/adenvt/recta-host)
[![Build status](https://ci.appveyor.com/api/projects/status/fpyk12ifj4j4re57/branch/master?svg=true)](https://ci.appveyor.com/project/adenvt/recta-host/branch/master)
[![GitHub version](https://badge.fury.io/gh/adenvt%2Frecta-host.svg)](https://badge.fury.io/gh/adenvt%2Frecta-host)

## Installation

### A) Installer

|        Platform        |                     32-bit                    |                    64-bit                   |
|------------------------|-----------------------------------------------|---------------------------------------------|
| Windows (.exe)         | [exe][win32-ia32-exe] - [zip][win32-ia32-zip] | [exe][win32-x64-exe] - [zip][win32-x64-zip] |
| Debian / Ubuntu (.deb) | [deb][linux-ia32-deb] - [zip][linux-ia32-zip] | [deb][linux-x64-deb] - [zip][linux-x64-zip] |
| Redhat / Centos (.rpm) | [rpm][linux-ia32-rpm] - [zip][linux-ia32-zip] | [rpm][linux-x64-rpm] - [zip][linux-x64-zip] |

#### Windows
Use [Zadig][zadig] to install the WinUSB driver for your USB device. Otherwise you will get `LIBUSB_ERROR_NOT_SUPPORTED` when attempting to open devices.

### B) Compile from Source

#### 1. Install Build Tools

##### On Windows

* **Fast Ways**: Microsoft's [windows-build-tools][win-build-tool], run `npm install --global --production windows-build-tools` on PowerShell or CMD.exe *(run as Administrator)*

* **Manual**: see [here][node-gyp#2]

##### On Linux

* **Python** v2.7
* **Build essential**: on Debian / Ubuntu, `sudo apt install build-essential`
* **Libudev**: on Debian / Ubuntu, `sudo apt install libudev-dev`

#### 2. Install Electron Forge

```bash
npm install -g electron-forge
```

#### 3. Install Dependencies

```bash
npm install
```

#### 4. Compiling

```bash
npm run make
```
You can find your installer on folder `out/make`

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

[win32-ia32-exe]: https://github.com/adenvt/recta-host/releases/download/1.0.0/recta-host-win32-ia32-1.0.0.exe
[win32-ia32-zip]: https://github.com/adenvt/recta-host/releases/download/1.0.0/recta-host-win32-ia32-1.0.0.zip
[win32-x64-exe]: https://github.com/adenvt/recta-host/releases/download/1.0.0/recta-host-win32-x64-1.0.0.exe
[win32-x64-zip]: https://github.com/adenvt/recta-host/releases/download/1.0.0/recta-host-win32-x64-1.0.0.zip
[linux-ia32-deb]: https://github.com/adenvt/recta-host/releases/download/1.0.0/recta-host-linux-ia32-1.0.0.deb
[linux-ia32-rpm]: https://github.com/adenvt/recta-host/releases/download/1.0.0/recta-host-linux-ia32-1.0.0.rpm
[linux-ia32-zip]: https://github.com/adenvt/recta-host/releases/download/1.0.0/recta-host-linux-ia32-1.0.0.zip
[linux-x64-deb]: https://github.com/adenvt/recta-host/releases/download/1.0.0/recta-host-linux-x64-1.0.0.deb
[linux-x64-rpm]: https://github.com/adenvt/recta-host/releases/download/1.0.0/recta-host-linux-x64-1.0.0.rpm
[linux-x64-zip]: https://github.com/adenvt/recta-host/releases/download/1.0.0/recta-host-linux-x64-1.0.0.zip
[zadig]: http://zadig.akeo.ie/
[win-build-tool]: https://github.com/felixrieseberg/windows-build-tools
[node-gyp#2]: https://github.com/nodejs/node-gyp#option-2
