const express = require('express')

const router = express.Router()
const users = require('../controllers/user')
const authJWT = require('../middlewares/auth')

router.get('/users', [authJWT.verifyToken], users.loginUser)
router.post('/register', users.registerUser)

module.exports = router