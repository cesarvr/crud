let api = require('./crud')
const express = require('express')

const app = express()

app.use('/api', api())
app.use('/', (req, res, next)=> {
  res.send(200).send('Service is active')
})

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log('crud server')
});

module.exports = server;
