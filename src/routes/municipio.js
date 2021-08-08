const express = require('express')
const mysql = require('../mysql/mysql').pool
const municipio = express.Router()
const login = require('../middleware/login')

//retorna todos os estados
municipio.get('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error })
    }
    conn.query('SELECT * FROM municipio', (error, result, fields) => {
      if (error) {
        return res.status(500).send({ error: error })
      }

      const response = {
        quantidade_de_municipio: result.length,
        municipio: result.map(prod => {
          return {
            id: prod.id,
            id_estado: prod.estado_id,
            nome: prod.nome,
            populacao: prod.populacao,
            request: {
              description: 'Veja vincolo do municipio ao estado.',
              url: 'http://localhost:3000/estado/' + prod.estado_id
            }
          }
        })
      }
      res.status(200).send(response)
    })
  })
})

//insere um estado
municipio.post('/', login, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error })
    }
    conn.query(
      'INSERT INTO municipio (estado_id, nome, populacao) VALUES (?,?,?)',
      [req.body.estado_id, req.body.nome, req.body.populacao],
      (error, result, field) => {
        conn.release()
        if (error) {
          return res.status(500).send({ error: error })
        }
        const response = {
          mensagem: 'Municipio criado com sucesso! ✔',
          municipioCriado: {
            id: req.body.id,
            nome: req.body.nome,
            populacao: req.body.populacao
          }
        }
        res.status(201).send(response)
      }
    )
  })
})

//retorna o dado de um municipio.
municipio.get('/:nome', login, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error })
    }
    conn.query(
      'SELECT * FROM municipio WHERE nome=?;',
      [req.params.nome],
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error })
        }
        return res.status(200).send({ response: result })
      }
    )
  })
})

//altera um municipio
municipio.patch('/', login, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error })
    }
    conn.query(
      'UPDATE municipio  SET nome = ?, populacao = ? WHERE id = ?',
      [req.body.nome, req.body.populacao, req.body.id],
      (error, result, field) => {
        //callback
        conn.release()

        if (error) {
          return res.status(500).send({ error: error })
        }
        if (result.affectedRows == 0) {
          return res.status(404).send({ mensagem: 'objeto não existe. 💥' })
        } else
          res.status(202).send({
            mensagem: 'Objeto alterado com sucesso! 🌩'
          })
      }
    )
  })
})

//deleta um municipio
municipio.delete('/', login, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error })
    }
    conn.query(
      'DELETE FROM municipio WHERE id = ?',
      [req.body.id],
      (error, result, field) => {
        //callback
        conn.release()

        if (error) {
          return res.status(500).send({ error: error })
        } else if (result.affectedRows == 0) {
          return res.status(404).send({ mensagem: 'objeto já excluído. 💥' })
        } else
          res.status(202).send({
            mensagem: 'Objeto removido com sucesso! ❌'
          })
      }
    )
  })
})

module.exports = municipio
