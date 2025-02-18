import express from "express";
import http from 'http';
import { Server } from 'socket.io';
import dotenv from "dotenv"
dotenv.config()

const app = express()

const server = http.createServer(app);
const io = new Server(server);

const websocketController = (io) => {
    io.on('connection', socket => {
        console.log('New websocket connection', socket.id)
    })
}
websocketController(io)

app.use(express.json())
app.get('/health', (req, res) => {
    res.status(200).send({ status: "OK" })
})

const main = async () => {
    try {
        const port = 8080
        const ip = '0.0.0.0'

        server.listen(port, ip, () => console.log(`Server running on http://${ip}:${port}`))
    } catch (error) {
        console.error(error)
    }
}


main()


