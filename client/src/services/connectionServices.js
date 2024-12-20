export const fetchGameMap = async (mapId) => {
    try {
        const res = await fetch(`/api/games/map/${mapId}`);
        if (!res.ok) {
            console.error('Failed to get game map');
        }
        return await res.json();
    } catch (error) {
        console.error('Error fetching game map:', error);
    }
};

export const getSessions = async () => {
    const playerId = window.localStorage.getItem('playerId')
    if(!playerId){
        return
    }
    const res = await fetch('/api/games/sessions?playerId=' + playerId)
    const data = await res.json()

    console.log(data)
    return data.map(session => session._id)
}

