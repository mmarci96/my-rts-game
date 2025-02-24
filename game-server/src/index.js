const express = require("express")
const mongoose = require("mongoose")
const gameRoutes = require("./routes/gameRoutes.js")
const errorHandler = require("./middleware/errorHandler.js")
const http = require('http');
const {Server} = require('socket.io');
const websocketController = require('./websockets/websocketController.js')
require('dotenv').config();

const { MONGO_URI } = process.env

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
    mongoose.connect(MONGO_URI)
    .then(() => console.log("Connected to db: ", MONGO_URI))
    .catch(err => console.error(err))

    const port = 8080
    const ip = '0.0.0.0'
    
    server.listen(port,ip, () => console.log(`Server running on http://${ip}:${port}`))
}


main()
    .then(() => console.log("all g"))
    .catch(err => console.error(err));


