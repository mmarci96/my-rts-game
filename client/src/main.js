import { io } from 'socket.io-client';

const socket = io();


const loadEvent = async () => {
    document.addEventListener('contextmenu', e => e.preventDefault());

    socket.on('connect', ()=>{
        console.log('Hello socket! Connected as ', socket.id)
    })
    
};

window.addEventListener('load', loadEvent);
