const express = require('express')
const cors = require("cors")
const apiRouter = require('./routes/api')
const app = express()

require('./db')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded())
app.use('/api', apiRouter)

app.listen(3000, () => {
    console.log('Servidor corriendo')
})