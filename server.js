const express = require('express')
const dotenv = require('dotenv')

dotenv.config({ path: './config/config.env' })
const app = express()

const PORT = process.env.PORT || 5000
const serverType = process.env.NODE_ENV || 'production'
app.listen(PORT, () => {
    console.log(`Server up and running in ${serverType} on port ${PORT}`)
})