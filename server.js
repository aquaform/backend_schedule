const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

const weeksRoutes = require('./routes/weeks.js')
const lessonsRoutes = require('./routes/lessons.js')

const app = express()
app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/schedule/', weeksRoutes)
app.use('/schedule/', lessonsRoutes)


const connectToDb = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/schedule', {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true 
        })
    } catch (e) {
        console.log(e);
    }
}

connectToDb().then(r => {
    app.listen(process.env.PORT || 5000);
    console.log('Server is start')
} )