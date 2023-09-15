const express = require("express")
const mysql = require('mysql');
const connection = require("../config/database")
module.exports = (app) => {
	const rotas = express.Router()
	rotas.get("/novarota", (req, res) => {
		res.send("Nova rota pra cliente")
	})

	rotas.get('/clientes', (req, res) => {
		connection.query(
			'select * from cliente',
			(err, results, fields) => {
				if (err) console.log(err)
				res.send(results)
			}
		);
	})

	rotas.get('/clientes/:id_cliente', (req, res) => {
		var id_cliente = req.params.id_cliente
		connection.query(
			`select * from cliente where id_cliente = ${id_cliente}`,//string inteligente(crase `)
			(err, results, fields) => {
				if (err) console.log(err)
				res.send(results)
			}
		);
	})

	rotas.post('/clientes', (req, res) => {
		var nome = req.body.nome
		var sobrenome = req.body.sobrenome
		var email = req.body.email
		var data_cadastro = moment().format("yyy-mm-DD")
		var salario = req.body.salario
		console.log(req.files)
		var sql = `insert into cliente(nome, sobrenome, email,`
			+ ` data_cadastro, salario) values("${nome}","${sobrenome}",` + `
		 "${email}", "${data_cadastro}", ${salario})`;

		connection.query(sql, (erro, resultado) => {
			if (erro) res.send(erro)
			var caminhoTemp = req.files.avatar.path
			var caminhoNovo = `./uploads/clientes/${resultado.insertId}.png`
			fs.copyFile(caminhoTemp, caminhoNovo, (err) => {
				console.log(err)
				res.send(resultado)
			})



		})
	})
	rotas.delete('/clientes_delete/:id_cliente', (req, res) => {
		var id_cliente = req.params.id_cliente
		connection.query(
			`delete from cliente where id_cliente = ${id_cliente}`,//string inteligente(crase `)
			(err, results, fields) => {
				if (err) console.log(err)
				res.send(results)
			}
		);
	})
	rotas.patch('/clientes/:id_cliente', (req, res) => {
		var nome = req.body.nome
		var sobrenome = req.body.sobrenome
		var email = req.body.email
		var salario = req.body.salario
		var id_cliente = req.params.id_cliente

		var sql = `update cliente set nome ="${nome}", sobrenome = "${sobrenome}", `
			+ `email = "${email}", salario = ${salario} where id_cliente = ${id_cliente}`

		connection.query(sql, (erro, resultado) => {
			if (erro) res.send(erro)
			res.send(resultado)
		})
	})

	rotas.get('/clientes/:email', (req, res) => {
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

	app.use("/", rotas)
}