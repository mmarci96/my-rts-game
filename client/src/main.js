import { io } from 'socket.io-client';
import GameLoader from './services/GameLoader';
import Game from './game/Game';
import AssetManager from './game/ui/AssetManager';

const socket = io();

const units = {}

const fetchData = async (userId, gameId, assets) => {
    const gameData = await GameLoader.fetchGameById(gameId)
    
    const mapId = gameData["mapId"];
    const map = await GameLoader.fetchGameMap(mapId)

    const sessionId = gameData["sessionId"]
    const sessionData = await GameLoader.fetchSessionData(sessionId)
    
    const game = new Game(map.tiles, assets)
    // game.loadGame(sessionData.units)
    return game;    
}

const socketHandler = socket => {
    socket.on('connect', ()=>{
        console.log('Hello socket! Connected as ', socket.id)
    })
    
    socket.on('unitUpdate', unitUpdates => {
        console.log(unitUpdates)
    })
}
const setLocalStorage = (userId, gameId) => {
    window.localStorage.setItem('userId', userId)
    window.localStorage.setItem('gameId', gameId)
}

const getLocalStorage = () => {
    const gameId = window.localStorage.getItem('gameId')
    const userId = window.localStorage.getItem('userId')
    return { gameId, userId}
}

const loadEvent = async () => {
    document.addEventListener('contextmenu', e => e.preventDefault());
    const { gameId, userId } = getLocalStorage();
    if(gameId && userId && window.location.pathname.split('/')[1] === 'play'){
        window.location.href = '/'
    } else {
        const path = window.location.pathname.split("/");
        const userId = path[3];
        const gameId = path[2];
        setLocalStorage(userId, gameId)
        //window.location.reload()
    }
    


    const assetManager = new AssetManager();
    await assetManager.loadAssets()
    
    const loadingIndicator = document.getElementById('loading-indicator'); // Show loading indicator
    loadingIndicator.style.display = 'block';

    try {
        const game = await fetchData(userId, gameId, assetManager)
        game.loadMap()
        console.log(game);
    } catch (err) {
        console.error('Error loading game:', err);
    } finally {
        loadingIndicator.style.display = 'none'; // Hide loading indicator once the game is loaded
    }
};

window.addEventListener('load', loadEvent);
