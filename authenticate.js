const _ = require('lodash')
const express = require('express')
const router = express.Router()

var pg = require('pg');
pg.defaults.ssl = true;

const userCache = {}

router.get('/:id/', function(req, res, next) {
  const id = req.params.id
  req.id = id
  if(_.has(userCache, id)) {
    console.log('found', id, 'in cache')
    next()
  } else {
    console.log('query for', id)
    pg.connect(process.env.DATABASE_URL, function(err, client) {
      if(err) {
        err.status = 500
        next(err)
      }
      client
        .on('drain', client.end.bind(client))
        .query('SELECT id, name FROM users')
        .on('row', updateCache)
        .on('end', function() {
          if(_.has(userCache, id)) {
            console.log('found', id, 'after query')
            next()
          } else {
            const err = new Error('Patron not found')
            err.status = 404
            next(err)
          }
        })
    });
  }

  function updateCache(row) {
    console.log('add from db', JSON.stringify(row))
    userCache[row.id] = {
      name: row.name
    }
  }
})

router.get('/*', function(req, res, next) {
  res.render('patron', {
    title: 'PDF Plugin Generator for patrons',
    rootUrl: `/${req.id}/`
  })
})

module.exports = router

