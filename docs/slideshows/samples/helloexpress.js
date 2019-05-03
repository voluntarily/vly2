const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/rick', (req, res) => res.send('Never going to give you up, Never going to let you down.'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
