const express = require('express')
const app = express()
const mysql = require('mysql');
const port = 3015
const bodyParser = require("body-parser")
const moment = require("moment")
const formData = require("express-form-data")
const fs = require("fs")

app.use(formData.parse())
app.use(bodyParser.urlencoded({ extended: true }))

require("./rotas/clientes")(app)
require("./rotas/fornecedores")(app)

app.get('/', (req, res) => {
	res.send(moment().format("YYYY-MM-DD"))
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})