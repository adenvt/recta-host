import HTTP from 'http'
import Socket from 'socket.io'
import EventEmitter from 'events'
import Printer from './printer.js'
import { CFG } from './constant.js'

export default class Service extends EventEmitter {
    constructor() {
        super()

        this.http = HTTP.createServer((req, res) => {
            res.end('Recta Print Service');
        })
        this.http.setTimeout(1000);

        this.io = Socket(this.http)
        this.io.use((socket, next) => {
            const token = socket.handshake.query.token
            const appkey = CFG.get('app.key')

            if (token !== appkey) {
                return next(new Error('Not Authorized'))
            }

            return next()
        })
        this.io.on('connection', (socket) => {
            socket.on('message', (data) => {
                this.emit('message', data)

                this.printer.print(new Buffer(data))
            })
        })

        this.printer = new Printer(CFG.get('printer.adapter'), CFG.get('printer.option'))
        this.printer.on('open', () => {
            this.emit('printer:open')
        })
        this.printer.on('close', () => {
            if (this.http.listening) {
                this.io.close(() => {
                    this.http.close(() => {
                        this.emit('error', new Error('Printer has closed'))
                        this.emit('close')
                    })
                })
            }

            this.emit('printer:close')
        })
        this.printer.on('error', (e) => {
            this.emit('error', e)
            this.emit('printer:error', e)
        })
    }

    start() {
        return new Promise((resolve, reject) => {
            this.http.listen(CFG.get('app.port'), (err) => {
                this.printer.open().then(() => {
                    this.emit('open')

                    return resolve()
                }).catch((e) => {
                    this.http.close(() => {
                        return reject(e)
                    })
                })
            }).once('error', (error) => {
                return reject(error)
            })
        })
    }

    stop() {
        return new Promise((resolve, reject) => {
            this.io.close(() => {
                this.http.close(() => {
                    this.printer.close().then(() => {
                        this.emit('close')

                        return resolve()
                    }).catch((e) => {
                        return reject(e)
                    })
                })
            })
        })
    }
}
