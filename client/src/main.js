import { io } from 'socket.io-client';
import GameLoader from './services/GameLoader';

const pendingCommands = []

const createCommand = (commands) => {
    //console.log(commands)
    pendingCommands.push(commands)
    //console.log(pendingCommands)
}


const socketHandler = (socket, game, userId) => {
    socket.on('connect', ()=>{
        console.log('Hello socket! Connected as ', socket.id)
        const units = game.getCurrentState();
        console.log(units)
        socket.emit('unitStatus', units)
    })

    socket.on('unitUpdate', unitUpdates => {
           console.log(unitUpdates)
    })

    const droprate = 5
    let c = 0
    setInterval(() => {
        if(pendingCommands.length > 0){
            socket.emit('commandRequest', pendingCommands)
            pendingCommands.filter(command => command === null)
            console.log(pendingCommands)
        }
        if(c > 5){
            c = 0
            socket.emit('unitStatus', game.getCurrentState())
        } else {
            c++
        }
    }, 1000)
}
   

const loadEvent = async () => {
    document.addEventListener('contextmenu', e => e.preventDefault());

    const path = window.location.pathname.split("/");
    const port = window.location.port
    console.log(port)
    
    const prefix = path[1];
    if(prefix === 'mapview'){
        const mapId = path[2];
        const mapViewer = await GameLoader.loadMapViewer(mapId, port)
        if(mapViewer){
            mapViewer.loadMap();
        }
    }else{
        const userId = path[3];
        const gameId = path[2];
        
        const game = await GameLoader.loadGame(userId, gameId, createCommand, port)
        
        const socket = io();
        socketHandler(socket, game, userId);
    }
};

window.addEventListener('load', loadEvent);
