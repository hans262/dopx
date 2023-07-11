import { createServer, Socket } from 'node:net'
import { createHash } from 'node:crypto'

/**
 * socket服务端
 */
export class SocketServer {
  sockets: Map<string, Socket> = new Map()

  createSocketKey() {
    const data = Date.now() + Math.random()
    return createHash('sha256').update(data.toString()).digest('hex')
  }

  constructor() {
    const server = createServer()
    server.on('connection', socket => {
      const key = this.createSocketKey()
      this.sockets.set(key, socket)
      // socket.write(`${key}`)

      socket.on('data', data => {
        console.log(data.toString())
      })

      socket.on('close', () => {
        console.log(`关闭了${key}`)
        this.sockets.delete(key)
      })

      socket.on('error', err => {
        console.log(err)
        this.sockets.delete(key)
      })
    })

    server.on('error', err => {
      console.log(err)
    })

    server.listen(9999, '127.0.0.1', () => {
      const tmp = `socket://127.0.0.1:9999`
      console.log('socket服务正在监听端口 -> ' + tmp)
    })

    process.on('uncaughtException', err => {
      //清理掉已经被销毁连接
      console.log(err)
    })
  }
}