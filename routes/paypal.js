'use strict'

const _ = require('lodash')
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const qs = require('querystring')
// const http = require('http')
const https = require('https')
const crypto = require('crypto')
const pg = require('pg');
pg.defaults.ssl = true;
const parser = bodyParser.text({type: '*/*'})

// router.post('/dummy', parser, function(req, res, next) {
//   console.log('dummy got', req.body)
//   res.end('VERIFIED')
// })

router.post('/', parser, function(req, res, next) {
  // console.log('HEADERS IPN', JSON.stringify(req.headers))
  console.log('RAW IPN', req.body)
  res.sendStatus(200)
  res.end()
  // console.log('IPN DONE')
  sendAck(req.body)
})

const address = {
  sandbox: {
    hostname: 'www.sandbox.paypal.com',
    path: '/cgi-bin/webscr',
  },
  production: {
    hostname: 'www.paypal.com',
    path: '/cgi-bin/webscr',
  },
  local: {
    hostname: 'localhost',
    port: 3000,
    path: '/webhook/dummy',
  }
}

function sendAck(data) {
  const params = qs.parse(data)
  if(params.test_ipn === '1') {
    handleNotification('VERIFIED', params)
    return
  }
  params.cmd = '_notify-validate'
  // const ret = 'cmd=_notify-validate&' + data
  // console.log("ACK DATA", params)
  const ret = qs.stringify(params)

  const options = _.extend(_.clone(address.production), {
    method: 'POST',
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': ret.length//Buffer.byteLength(ret)
    }
  })
  // console.log('ACK REQ', options)
  const req = https.request(options, (res) => {
    // console.log('ACK statusCode: ', res.statusCode)
    // console.log('ACK headers: ', JSON.stringify(res.headers))
    // console.log('ACK TYPE', res.headers['content-type'])
    // console.log('ACK LEN', res.headers['content-length'])
    var buf = ''
    res.on('data', (d) => {
      buf += d;
    })
    res.on('end', () => {
      handleNotification(buf, params)
    })
  })
  req.write(ret)
  req.on('error', (e) => {
    console.error('ACK ERROR', e)
  })
  req.end()
}

const salt = '6f6fa46e2ee30c6a4c7f67202a310863b69bb208'
function handleNotification(ack, data) {
  // console.log('ACK ' + ack)
  if(ack === 'VERIFIED') {
    pg.connect(process.env.DATABASE_URL, addUser(data));
  } else {
    console.error("Failed to verify notification")
  }
}

function addUser(data) {
  const id = getId(data.payer_email)
  return function(err, client) {
    if(err) {
      console.error("Failed to process verification: " + err)
    }
    client
      .on('drain', client.end.bind(client))
      .query(`INSERT INTO users (id, email, created, contribution, name)
              VALUES ($1, $2, $3, $4, $5)
              ON CONFLICT (id) DO NOTHING;`,
        [id, data.payer_email, data.payment_date, data.mc_gross, data.first_name + ' ' + data.last_name])
      // .on('row', updateCache)
      .on('error', (e) => {
        console.error('Failed to update user information: ' + e)
      })
      .on('end', notifyUser(id, data))
  }
}

function notifyUser(id, data) {
  return function() {
    const mailer = require("nodemailer");

    const smtpTransport = mailer.createTransport({
      host: 'mail1.sigmatic.fi',
      port: 587,
      auth: {
        user: 'jarno@elovirta.com',
        pass: process.env.EMAIL_PASSWORD
      }
    })

    const mail = getEmail(id, data)

    smtpTransport.sendMail(mail, function(error, res) {
      if(error) {
        console.error("Failed to send confirmation email: " + error)
      } else {
        console.log("Message sent: " + res.message)
      }
      smtpTransport.close()
    })
  }

  function getEmail(id, data) {
    const email = data.payer_email
    const name = data.first_name + ' ' + data.last_name
    const url = 'http://dita-generator.elovirta.com/' + id + '/'

    return {
      from: 'Jarno Elovirta <jarno@elovirta.com>',
      to: `${name} <${email}>`,
      subject: 'Thank you for your donation to PDF Plugin Generator',
      text: `Hi ${data.first_name}!

Who's awesome? You're awesome! Thank you for your donation for open source work.

As a token of my appreciation, you can find additional PDF plugin generator features at
${url}, available only for patrons like you.

Cheers,

Jarno`,
      html: `<p>Hi ${data.first_name}!<br>
<br>
Who's awesome? You're awesome! Thank you for your donation for open source work.<br>
<br>
As a token of my appreciation, you can find additional PDF plugin generator features at
<a href="${url}">${url}</a>, available only for patrons like you.<br>
<br>
Cheers,<br>
<br>
Jarno</p>`
    }
  }
}

function getId(email) {
  const shasum = crypto.createHash('sha1')
  shasum.update(email + salt)
  return shasum.digest('hex')
}

module.exports = router
