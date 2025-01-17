const express = require("express")
const mongoose = require("mongoose")
const gameRoutes = require("./routes/gameRoutes.js")
const errorHandler = require("./middleware/errorHandler.js")
const http = require('http');
const {Server} = require('socket.io');
const websocketController = require('./websockets/websocketController.js')
require('dotenv').config();

const { MONGO_URI, PORT } = process.env

const app = express()

const server = http.createServer(app);
const io = new Server(server);
websocketController(io)

app.use(express.json())
app.use('/api/games', gameRoutes)
app.get('/health', (req, res) => {
    res.status(200).send({status: OK})
})
app.use(errorHandler)



const main = async () => {
    const uri = process.env.MONGO_URI;
    console.log('MONGO_URI: ',MONGO_URI)
    console.log("miniui", uri)
    mongoose.connect(MONGO_URI)
    .then(() => console.log("Connected to db: ", MONGO_URI))
    .catch(err => console.error(err))

    const port = parseInt(PORT)
    const fuck = 8080
    
    server.listen(fuck,'0.0.0.0', () => console.log(`Server running on http://localhost:${PORT}`))
}


main()
    .then(() => console.log("all g"))
    .catch(err => console.error(err));


