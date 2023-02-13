const express = require('express')

const router = express.Router()
const users = require('../controllers/user')
const authJWT = require('../middlewares/auth')

router.get('/users', users.loginUser)
router.get('/profiles', [authJWT.verifyToken], users.profiles)
router.post('/register', users.registerUser)

module.exports = router