
const SessionService = require('../service/session.service.js');
const { ObjectId } = require('mongodb'); // Correct usage of MongoDB ObjectId

// In-memory stores for sessions, connections, and units
const sessions = {};
const connections = {};
const units = {};

/**
 * Add a session and initialize user data.
 * @param {Object} sessionData - The session data containing gameId, userId, sessionId, mapId.
 */
const addSession = ({ gameId, userId, sessionId, mapId }, socketId) => {
    //console.log('Adding session:', { gameId, sessionId, mapId });
    sessions[sessionId] = {
        gameId, [userId]: socketId, mapId,
    }
    //console.log(sessions)
    //
    //// Initialize the session if it doesn't exist
    //if (!sessions[sessionId]) {
    //    sessions[sessionId] = { users: {}, gameData: {} };
    //}
    //
    //// Add or update user data in the session
    //sessions[sessionId].users[userId] = { data: [] };
    //
    //console.log('Current sessions:', sessions[sessionId]);
    //
    //// Load units for the session asynchronously
    //const loadedUnits = await unitLoader(sessionId);
    //if (loadedUnits) {
    //    units[sessionId] = loadedUnits; // Save loaded units in memory
    //    console.log('Units for session updated:', units[sessionId]);
    //    return units[sessionId]
    //}
};

/**
 * Socket.IO connection handler.
 * @param {Object} io - The Socket.IO instance.
 */
module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New connection:', socket.id);

        // Handle session loading
        socket.on('loadSession', (data) => {
            connections[socket.id] = data; // Track the connection
            //console.log('Session load :', data);

            // Add session and join the user to the session's room
            socket.join(data.sessionId);
            addSession(data, socket.id)
        });
        socket.on('unitStatus', updateData => {
            console.log('on unitStatus',updateData)

        })

        socket.on('commandRequest', commands => {
            console.log(commands)
        })

        // Handle session updates
        socket.on('updateSession', (sessionData) => {
            const sessionId = sessionData['_id']
            sessionData.units.forEach(unit => {
                console.log('on updateSession',unit)
                units[unit.id] = { ...unit }
            });

            sessions[sessionId] = { units }
            console.log('seessions',sessions)
           
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);

            // Clean up connection data
            const sessionData = connections[socket.id];
            if (sessionData) {
                const { sessionId, userId } = sessionData;
                delete sessions[sessionId];

                // If no users remain in the session, clean it up
               
            }
            delete connections[socket.id];
        });
    });
};


