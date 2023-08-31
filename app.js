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

const connection = mysql.createConnection({
	host: 'aulascefet.c8tuthxylqic.sa-east-1.rds.amazonaws.com',
	user: 'aluno',
	password: 'alunoc3f3t',
	database: 'aulas_web',
});

app.get('/', (req, res) => {
	res.send(moment().format("YYYY-MM-DD"))
})

app.get('/clientes', (req, res) => {
	connection.query(
		'select * from cliente',
		(err, results, fields) => {
			if (err) console.log(err)
			res.send(results)
		}
	);
})

app.get('/clientes/:id_cliente', (req, res) => {
	var id_cliente = req.params.id_cliente
	connection.query(
		`select * from cliente where id_cliente = ${id_cliente}`,//string inteligente(crase `)
		(err, results, fields) => {
			if (err) console.log(err)
			res.send(results)
		}
	);
})

app.post('/clientes', (req, res) => {
	var nome = req.body.nome
	var sobrenome = req.body.sobrenome
	var email = req.body.email
	var data_cadastro = moment().format("yyy-mm-DD")
	var salario = req.body.salario
	console.log(req.files)
	/*var sql = `insert into cliente(nome, sobrenome, email,`
		+ ` data_cadastro, salario) values("PedroAula","SouzaAULA",` + `
	 "email@gmail.com", "2023-08-25", 1550)`;*/
	var sql = `insert into cliente(nome, sobrenome, email,`
		+ ` data_cadastro, salario) values("${nome}","${sobrenome}",` + `
	 "${email}", "${data_cadastro}", ${salario})`;

	connection.query(sql, (erro, resultado) => {
		if (erro) res.send(erro)
		var caminhoTemp = req.files.avatar.path
		var caminhoNovo = `./uploads/clientes/${resultado.insetId}.png`
		fs.copyFile(caminhoTemp, caminhoNovo, (err) => {
			console.log(err)
			res.send(resultado)
		})
		//fs.copyFile(req.files.avatar.path, `./uploads/clientes/${resultado.insetId}.png`,


	})
})

app.post('/clientes_delete/:id_cliente', (req, res) => {
	var id_cliente = req.params.id_cliente
	connection.query(
		`delete from cliente where id_cliente = ${id_cliente}`,//string inteligente(crase `)
		(err, results, fields) => {
			if (err) console.log(err)
			res.send(results)
		}
	);
})

app.patch('/clientes', (req, res) => {
	var sql = `update cliente set nome ="JoaoAula", sobrenome = "SilvaAula"`
		+ `email = "outro@outro.com", salario = 2500 where id_cliente = 56`

	connection.query(sql, (erro, resultado) => {
		if (erro) res.send(erro)
		res.send(resultado)
	})
})

app.get('/clientes/:email', (req, res) => {
	var email = req.params.email
	connection.query(
		`select * from cliente where email = "${email}"`,//string inteligente(crase `)
		(err, results, fields) => {
			if (err) console.log(err)
			if (results.length > 0) res.send({ existe: true })
			else res.send({ existe: false })

		}
	);
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})