const express = require('express')
const mysql = require('../mysql/mysql').pool
const estado = express.Router()

//retorna todos os estados
estado.get('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error })
    }
    conn.query('SELECT * FROM estado', (error, result, fields) => {
      if (error) {
        return res.status(500).send({ error: error })
      }

      const response = {
        quantidade_de_estados: result.length,
        estados: result.map(prod => {
          return {
            id: prod.id,
            id_pais: prod.id_pais,
            nome: prod.nome,
            uf: prod.uf,
            request: {
              description: 'Veja vincolo do estado ao país.',
              url: 'http://localhost:3000/pais/' + prod.pais_id
            }
          }
        })
      }
      res.status(200).send(response)
    })
  })
})

//insere um estado
estado.post('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error })
    }
    conn.query(
      'INSERT INTO estado (pais_id, nome, uf) VALUES (?,?,?)',
      [req.body.pais_id, req.body.nome, req.body.uf],
      (error, result, field) => {
        conn.release()
        if (error) {
          return res.status(500).send({ error: error })
        }
        const response = {
          mensagem: 'Estado criado com sucesso! ✔',
          estadoCriado: {
            nome: req.body.nome,
            uf: req.body.uf
          }
        }
        res.status(201).send(response)
      }
    )
  })
})

//retorna o dado de um estado.
estado.get('/:id', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error })
    }
    conn.query(
      'SELECT * FROM estado WHERE id=?;',
      [req.params.id],
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error })
        }
        return res.status(200).send({ response: result })
      }
    )
  })
})

//altera um estado
estado.patch('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error })
    }
    conn.query(
      'UPDATE estado  SET nome = ?, uf = ? WHERE id = ?',
      [req.body.nome, req.body.uf, req.body.id],
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

//deleta um estado
estado.delete('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error })
    }
    conn.query(
      'DELETE FROM estado WHERE id = ?',
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

module.exports = estado
