import { io } from 'socket.io-client';
import GameLoader from './services/GameLoader';
import Game from './game/Game';
import AssetManager from './game/ui/AssetManager';
import Player from './game/data/Player';

const socket = io();

const units = {}

const loadGameData = async (userId, gameId) => {
    const gameData = await GameLoader.fetchGameById(gameId)
    
    const mapId = gameData["mapId"];
    const mapData = await GameLoader.fetchGameMap(mapId)

    const sessionId = gameData["sessionId"]
    const sessionData = await GameLoader.fetchSessionData(sessionId)

    const assets = await GameLoader.loadAssets();

    const { color } = gameData.players.find(p => p.userId === userId)

    const player = new Player(userId, color)
    console.log(player)
    const game = new Game(mapData.tiles, assets, sessionData.units, player)
    game.setupPain();
    
    console.log("Assets: ", assets)
    console.log("Game: ",gameData)
    console.log("Session: ", sessionData)
    console.log("Map: ",mapData)
}

const socketHandler = socket => {
    socket.on('connect', ()=>{
        console.log('Hello socket! Connected as ', socket.id)
    })
    
    socket.on('unitUpdate', unitUpdates => {
        console.log(unitUpdates)
    })
}
   

const loadEvent = async () => {
    document.addEventListener('contextmenu', e => e.preventDefault());

    const path = window.location.pathname.split("/");
    const userId = path[3];
    const gameId = path[2];
    loadGameData(userId, gameId)



};

window.addEventListener('load', loadEvent);
