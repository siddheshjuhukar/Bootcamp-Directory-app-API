const express = require('express')
const dotenv = require('dotenv')
const logger = require('./middleware/logger')
const morgan = require('morgan')
const connectDB = require('./config/db')

dotenv.config({ path: './config/config.env' })

//Connect to Database
connectDB()

//Route files
const bootcamps = require('./routes/bootcamps')

const app = express()

//Dev logging middleware
app.use(morgan('dev'))

//Mount routes
app.use('/api/v1/bootcamps', bootcamps)

const PORT = process.env.PORT || 5000
const serverType = process.env.NODE_ENV || 'production'
const server = app.listen(PORT, () => {
    console.log(`Server up and running in ${serverType} on port ${PORT}`)
})

process.on('unhandledRejection', (error, promise) => {
    console.log(`Error: ${error.message}`)
    //Close server and exit process
    server.close(() => process.exit(1))
})