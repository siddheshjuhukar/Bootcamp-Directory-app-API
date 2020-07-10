const express = require('express')
const dotenv = require('dotenv')
const logger = require('./middleware/logger')
const morgan = require('morgan')

//Route files
const bootcamps = require('./routes/bootcamps')

dotenv.config({ path: './config/config.env' })
const app = express()

//Dev logging middleware
app.use(morgan('dev'))

//Mount routes
app.use('/api/v1/bootcamps', bootcamps)

const PORT = process.env.PORT || 5000
const serverType = process.env.NODE_ENV || 'production'
app.listen(PORT, () => {
    console.log(`Server up and running in ${serverType} on port ${PORT}`)
})