const express = require('express')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb')
const bodyparser = require('body-parser')
const cors = require('cors')

dotenv.config()

// Connecting to the MongoDB Client
const url = process.env.MONGO_URI
const client = new MongoClient(url)

// App & Database
const dbName = process.env.DB_NAME
const app = express()

// Render provides PORT through environment variable
const port = process.env.PORT || 3000

// Middleware
app.use(bodyparser.json())
app.use(cors())

// Get all the passwords
app.get('/', async (req, res) => {
    try {
        const db = client.db(dbName)
        const collection = db.collection('passwords')

        const findResult = await collection.find({}).toArray()

        res.json(findResult)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            error: 'Failed to fetch passwords'
        })
    }
})

// Save a password
app.post('/', async (req, res) => {
    try {
        const password = req.body

        const db = client.db(dbName)
        const collection = db.collection('passwords')

        const findResult = await collection.insertOne(password)

        res.send({
            success: true,
            result: findResult
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({
            success: false,
            error: 'Failed to save password'
        })
    }
})

// Delete a password by id
app.delete('/', async (req, res) => {
    try {
        const password = req.body

        const db = client.db(dbName)
        const collection = db.collection('passwords')

        const findResult = await collection.deleteOne(password)

        res.send({
            success: true,
            result: findResult
        })
    } catch (error) {
        console.error(error)
        res.status(500).send({
            success: false,
            error: 'Failed to delete password'
        })
    }
})

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})