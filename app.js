const express = require('express')
const app = express()
const port = 3002

app.get('/users', (req, res) => {
    const {name, lastname} = req.query;
  res.send(`Hello ${name} ${lastname}!`)
})

app.post('/users', (req, res) => {
  res.send('Got a POST request at /user')
})

app.put('/users', (req, res) => {
  res.send('Got a PUT request at /user')
})

app.delete('/users', (req, res) => {
  res.send('Got a DELETE request at /user')
})

app.use((req, res) => {
  res.status(404).send('Not Found')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
