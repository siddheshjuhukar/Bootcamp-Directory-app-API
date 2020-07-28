const express = require('express')
const dotenv = require('dotenv')
const logger = require('./middleware/logger')
const morgan = require('morgan')
const colors = require('colors')
const fileupload = require('express-fileupload')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')
const path = require('path')

dotenv.config({ path: './config/config.env' })

//Connect to Database
connectDB()

//Route files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')

const app = express()

//Body parser
app.use(express.json())

//Dev logging middleware
app.use(morgan('dev'))

// File uploading
app.use(fileupload())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

//Mount routes
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)

app.use(errorHandler)

const PORT = process.env.PORT || 5000
const serverType = process.env.NODE_ENV || 'production'
const server = app.listen(PORT, () => {
    console.log(`Server up and running in ${serverType} on port ${PORT}`.yellow.bold)
})

process.on('unhandledRejection', (error, promise) => {
    console.log(`Error: ${error.message}`.red)
    //Close server and exit process
    server.close(() => process.exit(1))
})