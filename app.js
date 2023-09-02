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

app.get('/fornecedores', (req, res) => {
	connection.query(
		'select * from fornecedor',
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

app.get('/fornecedores/:id_fornecedor', (req, res) => {
	var id_fornecedor = req.params.id_fornecedor
	connection.query(
		`select * from fornecedor where id_fornecedor = ${id_fornecedor}`,//string inteligente(crase `)
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




app.post('/fornecedores', (req, res) => {
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



app.delete('/clientes_delete/:id_cliente', (req, res) => {
	var id_cliente = req.params.id_cliente
	connection.query(
		`delete from cliente where id_cliente = ${id_cliente}`,//string inteligente(crase `)
		(err, results, fields) => {
			if (err) console.log(err)
			res.send(results)
		}
	);
})

app.delete('/fornecedores_delete/:id_fornecedor', (req, res) => {
	var id_fornecedor = req.params.id_fornecedor
	connection.query(
		`delete from fornecedor where id_fornecedor = ${id_fornecedor}`,//string inteligente(crase `)
		(err, results, fields) => {
			if (err) console.log(err)
			res.send(results)
		}
	);
})

app.patch('/clientes/:id_cliente', (req, res) => {
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


/*

  `id_fornecedor` int(11) NOT NULL AUTO_INCREMENT,

  `razao` varchar(100) NOT NULL,

  `cpf_cnpj` varchar(45) NOT NULL,

  `contato` varchar(45) NOT NULL,

  `logradouro` varchar(100) DEFAULT NULL,

  `cidade` varchar(45) DEFAULT NULL,

  `uf` varchar(2) DEFAULT NULL,


*/

app.patch('/fornecedores/:id_fornecedor', (req, res) => {
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