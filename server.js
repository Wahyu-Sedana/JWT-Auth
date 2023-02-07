const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./src/routes/routes')

require('dotenv').config()
const PORT = process.env.PORT || 5002

app.use(cors())

app.use(express.json({
  limit: '5mb'
}))
app.use(express.urlencoded({
  extended: true
}))

app.use('/api', router)

app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}`);
})

