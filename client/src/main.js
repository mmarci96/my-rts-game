import {createSessionForm, joinSessionForm, loginForm, signupForm } from './components/forms.js';
import {fetchGameMap, getSessions } from './services/connectionServices.js';
import Game from './game/Game.js'
import lobby from "./components/lobby.js";
import { io } from 'socket.io-client';

const socket = io();


const loadEvent = async () => {
    document.addEventListener('contextmenu', e => e.preventDefault());
    const name = window.localStorage.getItem('name')
    const playerId = window.localStorage.getItem('playerId')
    if(!name){
        console.log(name)
        signupForm()
        loginForm()
    }
    if(name){
        createSessionForm()
        joinSessionForm()
        await getSessions()
    }
    const currentSession = window.localStorage.getItem('sessionId')
    const mapId = window.localStorage.getItem('mapId')
    if(currentSession && mapId){
        const root = document.getElementById('root')
        root.innerHTML = "" +
        '<canvas id="map-canvas"></canvas>' + 
        '<canvas id="unit-canvas"></canvas>' +
        '<canvas id="ui-canvas"></canvas>';
        //console.log('lets connect to socket? or pring map')


        const { map } = await fetchGameMap(mapId)
        console.log(map)
        const game = new Game(map)
        
        lobby(socket, currentSession, playerId, game)
    }
};

window.addEventListener('load', loadEvent);
