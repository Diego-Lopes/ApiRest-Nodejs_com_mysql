const express = require('express')
const mysql = require('../mysql/mysql').pool
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/cadastro', (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ error: error })
    }
    conn.query(
      //tratativa de erro, caso usuário já está cadastrado.
      'SELECT * FROM usuarios WHERE email = ?',
      [req.body.email],
      (error, results) => {
        if (error) {
          return res.status(500).send({ error: errBcrypt })
        }
        if (results.length > 0) {
          res.status(409).send({ mensagem: 'Usuário já cadastrado 🚫' })
        } else {
          //caso não esteja, já cadastra.
          bcrypt.hash(req.body.senha, 5, (errBcrypt, hash) => {
            if (errBcrypt) {
              return res.status(500).send({ error: errBcrypt })
            }
            conn.query(
              'INSERT INTO usuarios (email, senha) VALUES (?, ?)',
              [req.body.email, hash],
              (error, results) => {
                conn.release()
                if (error) {
                  return res.status(500).send({ error: error })
                }
                response = {
                  mensagem: 'Usuario cadastrado com sucesso 🎉',
                  usuarioCriado: {
                    id_usuario: results.insertId,
                    email: req.body.email
                  }
                }
                return res.status(201).send(response)
              }
            )
          })
        }
      }
    )
  })
})

router.post('/login', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error })
    } //validação da senha.
    const query = `SELECT * FROM usuarios WHERE email = ?`
    conn.query(query, [req.body.email], (error, results, fields) => {
      conn.release()
      if (error) {
        return res.status(500).send({ error: error })
      }
      if (results.length < 1) {
        return res.status(401).send({ mensagem: 'Falha na autenticação ⚠' })
      }
      bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
        if (err) {
          //quando erra a senha.
          return res.status(401).send({ mensagem: 'Falha na autenticação ⚠' })
        }
        if (result) {
          //quando acerta a senha
          const token = jwt.sign(
            {
              id_usuario: results[0].id_usuario,
              email: results[0].email
            },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
          )
          return res
            .status(200)
            .send({ mensagem: 'Autenticado com sucesso 🔓', token: token })
        }
        //caso erre a senha passa aqui para falha
        return res.status(401).send({ mensagem: 'Falha na autenticação ⚠' })
      })
    })
  })
})

module.exports = router
