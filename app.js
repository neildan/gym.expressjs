const express = require('express')

const app = express();

require('./db')

app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => {
    res.send('Hi Word')
})

app.listen(3000, () => {
    console.log('Servidor corriendo')
})