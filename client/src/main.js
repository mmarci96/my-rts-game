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
            game.refreshUnitData(data.units)
        }
    })

    const commandInterval = setInterval(() => {
        if(pendingCommands.length >= 1){
            socket.emit('pendingCommands', pendingCommands)
            pendingCommands = []
            console.log('Commands added to stack')
        }
    }, 60);

    socket.on('gameOver', winData => {
        console.log('winner is: ', winData)
        const {winner} = winData
        game.stopGame();
        displayGameOver(winner);
        clearInterval(commandInterval);
        socket.disconnect();
        return;
    })

}

const displayGameOver = (winner) => {
    const root = document.getElementById('root')
    root.innerHTML = '';
    const gameOverScene = document.createElement('div')
    gameOverScene.classList = 'game-over'
    root.appendChild(gameOverScene);
    gameOverScene.innerText = 'Player: ' + winner + ", has won!";
}
  
const getIdFromUrl = (url) => {
    const arr = url.split("/");
    const lastIndex = arr.length - 1

    return {
        gameId: arr[lastIndex-1],
        userId: arr[lastIndex]
    }
}

const loadEvent = async () => {
    document.addEventListener('contextmenu', e => e.preventDefault());

    const url = window.location.pathname;
    const { gameId, userId } = getIdFromUrl(url);
    
    if(prefix === 'mapview'){
        const mapId = userId 
        const mapViewer = await GameLoader.loadMapViewer(mapId)
        if(mapViewer){
            mapViewer.loadMap();
        }
    }else{
        const game = await GameLoader.loadGame(userId, gameId, createCommand)
        
        const socket = io();
        socketHandler(socket, game, userId, gameId);
    }
};

window.addEventListener('load', loadEvent);
