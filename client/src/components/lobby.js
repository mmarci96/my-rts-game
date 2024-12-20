const players = {}

const lobby = (socket, sessionId, playerId, game) => {
	socket.on('connect', () => {
		console.log('Connected as: ', socket.id)
	})

	const data = {sessionId, playerId}
	socket.emit('session', data);

	socket.emit('onLoad', sessionId);

	socket.on('updateData', session => {
		console.log('updateData', session);
		socket.emit('updateUnits', sessionId)
	})

	socket.on('unitData', data => {
		console.log('unitData on socket: ', data);
		console.log(game)
		game.loadGame(data)
	})

	setInterval(() => {
		socket.volatile.emit("ping", sessionId);
	}, 1000);


}

export default lobby;
