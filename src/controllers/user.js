const db = require('../helper/db')
const crypto = require('crypto')

const jwt = require('jsonwebtoken')
const { AUTH_CONF } = process.env;

const responseBody = {
  success: false,
  message: 'paramater tidak valid',
  data: [],
  token: 'tidak ada'
}

const registerUser = async (req, res) => {
  let { name, email, password, role } = req.body
  role = 'customer'
  try {
    let pass = crypto.createHash('md5').update(password).digest('hex')
    let [checkData] = await db.query('SELECT * FROM users WHERE email= :email', { email })
    if(checkData){
      if(Object.keys(checkData).length > 0){
        console.log('email sudah terdaftar');
        responseBody.success = true
        responseBody.message = 'email sudah terdaftar'
      }
    }else {
      let data = await db.query("INSERT INTO users(name, email, password, role) VALUES(:name, :email, :password, :role)", { name, email, password:pass, role })
      console.log(data);
      responseBody.success = true
      responseBody.message = 'berhasil registrasi'
    }
  } catch (error) {
    console.log(error);
    responseBody.success = false
    responseBody.message = error
  }
  return res.json(responseBody)
}

const loginUser = async (req, res) => {
  let { email, password } = req.body
  try {
    let pass = crypto.createHash('md5').update(password).digest('hex')
    let data = await db.query('SELECT * FROM users WHERE email= :email AND password= :password', { email, password: pass })
    console.log(data);
    const token = jwt.sign({ userId: data.user_id }, AUTH_CONF, { expiresIn: '24h' })
    if(Object.keys(data).length === 0){
      responseBody.success = true
      responseBody.message = 'belum mempunyai akun, silahkan registrasi terlebih dahulu'
    }else {
      responseBody.success = true
      responseBody.message = 'berhasil login'
      responseBody.data = data
      responseBody.token = token
    }
  } catch (error) {
    responseBody.success = false
    responseBody.message = error
  }
  return res.json(responseBody)
}

const profiles = async (req, res) => {
  let { email } = req.body
  try {
    let data = await db.query('SELECT email FROM users WHERE email= :email', { email })
    console.log(data);
    const token = jwt.sign({ userId: data.user_id }, AUTH_CONF, { expiresIn: '24h' })
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

module.exports = { registerUser, loginUser, profiles }