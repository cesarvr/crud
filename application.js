const CRUD = require('./crud')
const express = require('express')

const app = express()

app.get('/', (req, res, next)=> {
  res.sendStatus(200).send('Service is active')
})

app.use('/api/', CRUD)

app.listen(8080,  () => {
  console.log('starting crud server 8080')
});

