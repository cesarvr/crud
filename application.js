let api = require('./crud')
const express = require('express')

const app = express()

app.use('/api', api())

app.get('/', (req, res, next)=> {
  res.sendStatus(200).send('Service is active')
})

app.listen(8080,  () => {
  console.log('starting crud server 8080')
});

