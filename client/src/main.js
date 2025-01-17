import { io } from 'socket.io-client';
import GameLoader from './services/GameLoader';
import Game from './game/Game';

let pendingCommands = []

const createCommand = (commands) => {
    commands.forEach(command => {
        pendingCommands.push(command)
    });
}

const socketHandler = (socket, game, userId, gameId) => {
    if(!(game instanceof Game)){
        throw new TypeError("Invalid game for socketconnection")
    }
    socket.on('connect', ()=>{
        const data = { 
            gameId, userId
        }
        socket.emit('startGame', data)
    })

    socket.on('gameState', data => {
        if(data.units.length > 1){
            //console.log(data)
            game.refreshUnitData(data.units)
        }
    })

    socket.on('gameOver', winData => {
        console.log('winner is: ', winData)
        const {winner} = winData
        game.stopGame();
        displayGameOver(winner); 
        return;
    })

    setInterval(() => {
        if(pendingCommands.length >= 1){
            socket.emit('pendingCommands', pendingCommands)
            pendingCommands = []
            console.log('Commands added to stack')
        }
    }, 60);
}

const displayGameOver = (winner) => {
    const root = document.getElementById('root')
    root.innerHTML = '';
    const gameOverScene = document.createElement('div')
    gameOverScene.classList = 'game-over'
    root.appendChild(gameOverScene);
    gameOverScene.innerText = 'Player: ' + winner + ", has won!";
}
   
const loadEvent = async () => {
    document.addEventListener('contextmenu', e => e.preventDefault());

    const path = window.location.pathname.split("/");
    const port = window.location.port
    
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
        socketHandler(socket, game, userId, gameId);
    }
};

window.addEventListener('load', loadEvent);
