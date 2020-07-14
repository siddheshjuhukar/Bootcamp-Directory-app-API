const mongoose = require('mongoose')

const connectDB = async () => {
    const connect = await mongoose.connect(process.env.MONGODBURI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })

    console.log(`MongoDB Connected: ${connect.connection.host}`)
}

module.exports = connectDB