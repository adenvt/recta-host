# Recta Host

> Direct printing from JS

## Installation

### Installer

|        Platform        |      Links      |
|------------------------|-----------------|
| Windows (.exe)         | [download][win] |
| Debian / Ubuntu (.deb) | [download][deb] |
| Redhat / Centos (.rpm) | [download][rpm] |

#### Windows
Use [Zadig][zadig] to install the WinUSB driver for your USB device. Otherwise you will get `LIBUSB_ERROR_NOT_SUPPORTED` when attempting to open devices.

### Compile from Source

#### 1. Install Build Tools

##### On Windows

* **Fast Ways**: Microsoft's [windows-build-tools][win-build-tool], run `npm install --global --production windows-build-tools` on PowerShell or CMD.exe *(run as Administrator)*

* **Manual**: see [here][node-gyp#2]

##### On Unix

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

[win]: http://recta.adenovid.net/1.0.0/bin/win/recta_1.0.1.exe
[deb]: http://recta.adenovid.net/1.0.0/bin/win/recta_1.0.1.deb
[rpm]: http://recta.adenovid.net/1.0.0/bin/win/recta_1.0.1.rpm
[zadig]: http://sourceforge.net/projects/libwdi/files/zadig/
[win-build-tool]: https://github.com/felixrieseberg/windows-build-tools
[node-gyp#2]: https://github.com/nodejs/node-gyp#option-2
