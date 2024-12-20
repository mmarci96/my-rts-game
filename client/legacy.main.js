import {createSessionForm, joinSessionForm} from './components/forms.js';
import {fetchGameMap} from './services/connectionServices.js';
import Game from "./game/Game.js";
import Player from "./game/data/Player.js";
import { io } from 'socket.io-client';

const socket = io();

const MAP = [];
const players = {};

const handleSocketConnection = (logic) => {
	socket.on('connect', () => {
		console.log('Connected to server with socket id:', socket.id);
	});

	socket.on('updatePlayers', backendPlayers => {

		for (const id in backendPlayers) {
			const backendPlayer = backendPlayers[id];
			if (!players[id]) players[id] = new Player(id, backendPlayer.color);
		}

		for (const id in players) {
			if (!backendPlayers[id]) delete players[id];
		}


		if (!logic.isInitialized) {
			const units = Object.values(backendPlayers).flatMap(player => {
				const {units} = player;
				if (!units) console.warn(`Unknown player: ${player}`);

				return Object.values(units);
			});

			logic.initGame(units, commandHandler);

			logic.setControllableUnits(backendPlayers[socket.id].color);
		}

		const updatedUnits = Object.values(backendPlayers).flatMap(player => {
			const { units } = player;
			if (!units) {
				console.warn(`Player with color ${player.color} has no units`);
				return [];
			}
			return Object.values(units);
		});

		if (logic.isInitialized) {
			// Trigger animations for updated units
			logic.refreshAnimations(updatedUnits);
		}
	});


	socket.on('disconnect', reason => {
		console.log('Disconnected from server. Reason:', reason);
		delete players[socket.id];
	});
};

const commandHandler = (unitId, targetX, targetY) => {
	console.log('Command Handler:', unitId, targetX, targetY);
	socket.emit('commandUnit', {unitId, targetX, targetY});
};

const loadEvent = async () => {

	document.addEventListener('contextmenu', e => e.preventDefault());

	const sessionId = window.localStorage.getItem('session_id');
	const playerId = window.localStorage.getItem('player_id');

	if (!sessionId || !playerId) {
		console.warn('Session or Player ID missing. Redirecting to player creation.');
		createSessionForm();
		joinSessionForm();
		return;
	}

	try {
		const {map} = await fetchGameMap(sessionId);
		MAP.push(...map);

		const game = await new Game(map);
		const logic = game.getLogic();

		await logic.loadMap();

		handleSocketConnection(logic);
	} catch (error) {
		console.error('Failed to load the game:', error);
	}
};

window.addEventListener('load', loadEvent);
