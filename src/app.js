const express = require('express')
const app = express()
const path = require('path')
const http = require('http').Server(app)
const port = process.env.PORT || 3000
const io = require('socket.io')(http)
const os = require('os')
const cors = require('cors')

// Accept Cross Origin Resource Sharing
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

http.listen(port, '0.0.0.0', () => {
  const ifaces = os.networkInterfaces()
  let network = void 0

  Object.keys(ifaces).forEach(ifname => {
    ifaces[ifname].forEach(iface => {
      if ('IPv4' !== iface.family || iface.internal !== false) return

      network = iface.address
    })
  })

  console.log(`local: http://localhost:${port}`)
  if (network) console.log(`external: http://${network}:${port}`)
})

// assets
app.use(express.static(path.join(__dirname, 'assets')))

// routes
app.use('/', require('./routes/index'))
app.use('/log', require('./routes/log'))

// socket.io
io.on('connection', socket => {
  socket.on('useSkill', skill => {
    io.emit('skill', skill)
  })
})
