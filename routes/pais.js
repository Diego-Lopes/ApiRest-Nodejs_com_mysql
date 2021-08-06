const express = require('express')

const pais = express.Router()
const mysql = require('../mysql/mysql').pool

//retorna todos os paises
pais.get('/', (req, res, next) => {
  // res.status(200).send({ mensagem: 'Usando o GET na rota de país' })
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error })
    }
    conn.query(
      'SELECT * FROM pais;',
      //callback
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error })
        }
        const response = {
          quantidade_de_pais: result.length,
          pais: result.map(prod => {
            return {
              id: prod.id,
              nome: prod.nome,
              sigla: prod.sigla
            }
          })
        }
        return res.status(200).send({ response })
      }
    )
  })
})

//insere um pais
pais.post('/', (req, res, next) => {
  //fazendo insert
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error })
    }
    conn.query(
      'INSERT INTO pais (nome, sigla) VALUES (? , ?)',
      [req.body.nome, req.body.sigla],
      (error, result, field) => {
        //callback
        conn.release()
        const response = {
          mensagem: 'Pais cadastrado com sucesso 🆗',
          paisCadastrado: {
            id: result.id,
            nome: req.body.nome,
            sigla: req.body.sigla
          }
        }
        if (error) {
          return res.status(500).send({ error: error })
        }
        res.status(201).send(response)
      }
    )
  })
})

//retorna o dado de um pais específico.
pais.get('/:id', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error })
    }
    conn.query(
      'SELECT * FROM pais WHERE id=?;',
      [req.params.id],
      //callback
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error })
        }
        return res.status(200).send({ response: result })
      }
    )
  })
})

//altera um pais
pais.patch('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error })
    }
    conn.query(
      'UPDATE pais  SET nome = ?, sigla = ? WHERE id = ?',
      [req.body.nome, req.body.sigla, req.body.id],
      (error, result, field) => {
        //callback
        conn.release()

        if (error) {
          return res.status(500).send({ error: error })
        }
        res.status(202).send({
          mensagem: 'Objeto alterado com sucesso! 🌩'
        })
      }
    )
  })
})

//deleta um pais
pais.delete('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error })
    }
    conn.query(
      'DELETE FROM pais WHERE id = ?',
      [req.body.id],
      (error, result, field) => {
        //callback
        conn.release()

        if (error) {
          return res.status(500).send({ error: error })
        }
        res.status(202).send({
          mensagem: 'Objeto removido com sucesso! ❌'
        })
      }
    )
  })
})

module.exports = pais
