const express = require('express')
const mysql = require('../mysql2/mysql2').pool
const router = express.Router()
const bcrypt = require('bcrypt')

router.post('./cadastrado', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error })
    }
    bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
      if (errBcrypt) {
        return res.statu(500).send({ error: errBcrypt })
      }
      conn.query(
        'INSERT INTO usuario (email, senha) VALUES (?, ?)',
        [req.body.email, hash],
        (error, results) => {
          conn.realease()
          if (error) {
            return res.status(500).send({ error: error })
          }
        }
      )
    })
  })
})

module.exports = router
