const express = require('express')
const path = require('path')


const app = express()
app.use(express.static(path.join(__dirname, 'client/')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/public/index.html'))
})

app.listen(8080, () => console.log('Example app listening on port 8080!'))