const path = require('path')
const express = require('express')

const port = process.env.SERVER_PORT || 3000

const app = express()

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './views/index.html'))
})

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, './views/contact.html'))
})

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, './views/about.html'))
})

app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, './views/404.html'))
})

app.listen(port, () => {
  console.log(`server starts listening on port ${port}`)
})
