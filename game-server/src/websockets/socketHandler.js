const sessions = {}
const connections = {}


const addSession = ({ sessionId, playerId }) => {
	console.log(playerId, sessionId);
	if (!sessions[sessionId]) {
		sessions[sessionId] = { [playerId]: { data: [] } };
		///const game = new Game(sessionId);
		//game.addPlayer(playerId);
		//sessions[sessionId].game = game;
	} else {
		sessions[sessionId][playerId] = { data: [] };
		//const { game } = sessions[sessionId];
		//game.addPlayer(playerId);
	}
	console.log(sessions[sessionId]);
};

module.exports = io => {
    io.on('connection', socket => {
        console.log('New connection: ', socket.id)

        socket.on('session', data => {
            connections[socket.id] = data
            console.log(data)
            
            addSession(data)
            socket.join(data.sessionId)
        })

        io.emit('updateSession', sessions)
        
        socket.on('disconnect', () => {
            console.log('User disconnected: ', socket.id)
            delete connections[socket.id]
        })
    })
}
