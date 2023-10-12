const express = require('express')
const app = express()

const port = 3015
const bodyParser = require("body-parser")
const formData = require("express-form-data")
const fs = require("fs")
const cors = require("cors")
const moment = require("moment")

app.use(formData.parse())
app.use(bodyParser.urlencoded({ extended: true }))


var corsOptions = {
	origin: 'http://127.0.0.1:5500',
	optionsSuccessStatus: 200
}

app.use(express.static('uploads'))
app.use(cors())

require("./rotas/clientes")(app)
require("./rotas/fornecedores")(app)

app.get('/', (req, res) => {
	res.send(moment().format("YYYY-MM-DD"))
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})


