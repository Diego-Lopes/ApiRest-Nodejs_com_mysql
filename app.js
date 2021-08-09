const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
//routers
const routersPais = require('./src/routes/pais')
const routersEstados = require('./src/routes/estados')
const routersMunicipios = require('./src/routes/municipio')
const routersUsers = require('./src/routes/usuarios')

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false })) //apenas dados simples
app.use(bodyParser.json()) //aceita somente formato json.

app.use('/pais', routersPais)
app.use('/estado', routersEstados)
app.use('/municipio', routersMunicipios)
app.use('/usuarios', routersUsers)

//informações do babeçalho
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  //asteristico representa todos, primeiro argumento acesso de permissão.
  //caso queira acessar um servidor específico e vise-versa substitua o asteristico pelo enderço.
  res.header(
    'Access-Control-Allow-Header',
    'Origin,Content-Type, X-Requested-With, Accept, Authorization'
  )
  //definindo tipos de cabeçalho aceitáveis.

  //client manda res chega OPTIONS então tratamos esse res, dando acesso ao método CRUD.
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).send({})
  }
  next()
})

//tratamento de erro quando não encontrar nem uma rota.

app.use((req, res, next) => {
  const erro = new Error('Rota não encontrada')
  erro.status = 404
  next(erro)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  return res.send({
    erro: {
      mensagem: error.message
    }
  })
})
module.exports = app
