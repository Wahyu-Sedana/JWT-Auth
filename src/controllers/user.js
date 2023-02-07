const db = require('../helper/db')
const crypto = require('crypto')

const jwt = require('jsonwebtoken')
const { AUTH_CONF } = process.env;

// const response = {
//   message: false,
//   data: []
// }

const registerUser = async (req, res) => {
  let { name, email, password, role } = req.body
  role = 'customer'
  try {
    let pass = crypto.createHash('md5').update(password).digest('hex')
    let [checkData] = await db.query('SELECT * FROM users WHERE email= :email', { email })
    if(checkData){
      if(Object.keys(checkData).length > 0){
        console.log('email sudah terdaftar');
        res.status(200).json({
          message: false,
          data: "email sudah terdaftar"
        })
      }
    }else {
      let data = await db.query("INSERT INTO users(name, email, password, role) VALUES(:name, :email, :password, :role)", { name, email, password:pass, role })
      console.log(data);
      res.status(200).json({
        message: true,
        data: "berhasil registrasi!"
      })
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: false,
      error: error
    })
  }
}

const loginUser = async (req, res) => {
  let { email, password } = req.body
  try {
    let pass = crypto.createHash('md5').update(password).digest('hex')
    let data = await db.query('SELECT * FROM users WHERE email= :email AND password= :password', { email, password: pass })
    console.log(data);
    const token = jwt.sign({ udata: data }, AUTH_CONF, { expiresIn: '24h' })
    res.status(200).json({
      message: true,
      data: data,
      token: token
    })
  } catch (error) {
    res.status(400).json({
      message: false,
      error: error
    })
  }
}

module.exports = { registerUser, loginUser }