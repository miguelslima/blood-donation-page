//configurando o servidor
const express = require("express");
const server = express();

//configurar o arquivo para arquivos estáticos
server.use(express.static('public'))

//Habilitar o body do form
server.use(express.urlencoded({ extended: true }));

//configurar a conexão com o banco de dados
const Pool = require('pg').Pool;
const db = new Pool({ 
  user: 'postgres',
  password: '',
  host: 'localhost',
  port: 5432,
  database: ''
 });

//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
  express: server,
  noCache: true,
})

//configurando a apresentação da página
server.get("/", function (req, res) {
  
  db.query("SELECT * FROM donors", function(err, result) {
    if (err) {
      console.log(err);
      return res.send("Erro no banco de dados!");
    }
    const donors = result.rows;

    return res.render("index.html", {donors});
  });
})

server.post("/", function(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const blood = req.body.blood;

  if( name == "" || email == "" || blood == "") {
    return res.send("Todos os campos são obrigatórios.")
  }

  const query =   
    `INSERT INTO donors ( "name", "email", "blood")
    VALUES ($1, $2, $3)`

  const values = [name, email, blood];

  db.query(query, values, function(err) {
    if (err) {
      console.log(err);
      return res.send("Erro no banco de dados");
    }
    return res.redirect("/");
  });
})

//ligando o servidor na porta 3000
server.listen(3000, function() {
  console.log("Servidor iniciado!")
});