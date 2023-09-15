const express = require("express")
const mysql = require('mysql');
const connection = require("../config/database")
module.exports = (app) => {
	const rotas = express.Router()
	rotas.get("/fornecedor", (req, res) => {
		res.send("fornecedores")
	})
	rotas.get('/fornecedores', (req, res) => {
		connection.query(
			'select * from fornecedor',
			(err, results, fields) => {
				if (err) console.log(err)
				res.send(results)
			}
		);
	})
	rotas.get('/fornecedores/:id_fornecedor', (req, res) => {
		var id_fornecedor = req.params.id_fornecedor
		connection.query(
			`select * from fornecedor where id_fornecedor = ${id_fornecedor}`,//string inteligente(crase `)
			(err, results, fields) => {
				if (err) console.log(err)
				res.send(results)
			}
		);
	})
	rotas.post('/fornecedores', (req, res) => {
		var razao = req.body.razao
		var cpf_cnpj = req.body.cpf_cnpj
		var contato = req.body.contato
		var logradouro = req.body.logradouro
		var cidade = req.body.cidade
		var uf = req.body.uf
		console.log(req.files)

		var sql = `insert into fornecedor(razao, cpf_cnpj, contato,`
			+ ` logradouro, cidade, uf) values("${razao}","${cpf_cnpj}",` + `
		 "${contato}", "${logradouro}", "${cidade}", "${uf}")`;

		//////////////////////AQUI Tá TUDO ERRADO/////////////////////////////////////////////////
		connection.query(sql, (erro, resultado) => {
			if (erro) res.send(erro)

			var caminhoTemp = req.files.avatar.path
			var caminhoNovo = `./uploads/fornecedores/${resultado.insertId}.png`
			fs.copyFile(caminhoTemp, caminhoNovo, (err) => {
				console.log(err)
				res.send(resultado)
			})
			////////////////////////////////////////////////////////////////////////
			//fs.copyFile(req.files.avatar.path, `./uploads/clientes/${resultado.insetId}.png`,


		})
	})

	rotas.delete('/fornecedores_delete/:id_fornecedor', (req, res) => {
		var id_fornecedor = req.params.id_fornecedor
		connection.query(
			`delete from fornecedor where id_fornecedor = ${id_fornecedor}`,//string inteligente(crase `)
			(err, results, fields) => {
				if (err) console.log(err)
				res.send(results)
			}
		);
	})

	rotas.patch('/fornecedores/:id_fornecedor', (req, res) => {
		var razao = req.body.razao
		var cpf_cnpj = req.body.cpf_cnpj
		var contato = req.body.contato
		var logradouro = req.body.logradouro
		var cidade = req.body.cidade
		var uf = req.body.uf
		var id_fornecedor = req.params.id_fornecedor

		var sql = `update fornecedor set razao = "${razao}", cpf_cnpj = "${cpf_cnpj}", `
			+ `contato = "${contato}", logradouro = "${logradouro}", cidade = "${cidade}", `
			+ `uf = "${uf}" where id_fornecedor = ${id_fornecedor}`

		connection.query(sql, (erro, resultado) => {
			if (erro) res.send(erro)
			res.send(resultado)
		})
	})

	app.use("/", rotas)
}