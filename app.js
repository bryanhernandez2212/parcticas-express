const express = require('express')
const app = express()
const port = 3002

app.get('/user', (req, res) => {
    const {name, lastname} = req.query;
  res.send(`Hello ${name} ${lastname}!`)
})

app.post('/', (req, res) => {
  res.send('Got a POST request')
})

app.put('/user', (req, res) => {
  res.send('Got a PUT request at /user')
})

app.delete('/user', (req, res) => {
  res.send('Got a DELETE request at /user')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
