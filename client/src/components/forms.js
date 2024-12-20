export const createSessionForm = () => {
    const div = document.createElement('div');
    div.innerHTML = '' +
		'<form id="create-session-form">' +
		'   <h1>Create a new session</h1>' +
    '   <label>Select how many players can join the lobby(2-3-4)</label>' +
		'   <input id="size" step="1" type="range" min="2" max="4" />' +
		'   <button class="btn-block" type="submit">Create Game</button>' +
		'</form>';
    document.getElementById('root').appendChild(div);
    const form = document.getElementById('create-session-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the form from sending a request
        const playerName = window.localStorage.getItem('name');
        const playerId = window.localStorage.getItem('playerId');
        const size = document.getElementById('size');

        fetch('/api/games/new-game', {
            method: 'POST',
            body: JSON.stringify({
                "playerName": playerName,
                "playerId": playerId,
                "size": size.value
                }),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(session => {
                console.log(session);
                window.localStorage.setItem('mapId', session.gameMap)
                window.localStorage.setItem('sessionId', session._id)
                window.location.reload()
            })
            .catch(err => console.log(err));
    });
}


export const joinSessionForm = () => {
	// Create a div and append it to the body
	const div = document.createElement('div');
	div.innerHTML = '' +
		'<form id="join-session-form">' +
		'   <h1>Join a session:</h1>' +
		'   <input id="session_id" type="text" placeholder="Join a session by using' +
		' a session id!"/>' +
		'   <button class="btn-block" type="submit">Start Game</button>' +
		'</form>';
	document.getElementById('root').appendChild(div);

	// Add an event listener to the form's submit event
	const form = document.getElementById('join-session-form');
	form.addEventListener('submit', (e) => {
		e.preventDefault(); // Prevent the form from sending a request
		const playerId = window.localStorage.getItem('playerId');
    const sessionId = document.getElementById('session_id');

		fetch('/api/games/join-game', {
			method: 'POST',
			body: JSON.stringify({
				"playerId": playerId,
				"sessionId": sessionId.value
			}),
			headers: {
				'Content-Type': 'application/json',
			}
		})
			.then(res => res.json())
			.then(session => {
                window.localStorage.setItem('mapId', session.gameMap)
                window.localStorage.setItem('sessionId', session._id)
                window.location.reload()
			})
			.catch(err => console.log(err));
	});
}
export const signupForm = () => {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = '' +
		'<form id="signup-form">' +
		'   <h1>Sign up to start:</h1>' +
		'   <input id="name" type="text" placeholder="Enter a name"/>' +
		'   <input id="password" type="password" placeholder="Enter your password..."/>' +
		'   <button class="btn-block" type="submit">Signup</button>' +
		'</form>';
	  const root = document.getElementById('root')
    // root.innerHTML = ''
    root.appendChild(formContainer)

	  const form = document.getElementById('signup-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the form from sending a request
		    const name = document.getElementById('name');
		    const password = document.getElementById('password');

        fetch('/api/auth/signup', {
			      method: 'POST',
			      body: JSON.stringify({
				        "name": name.value,
				        "password": password.value
			      }),
			      headers: {
				        'Content-Type': 'application/json',
			      }
        })
            .then(res => res.json())
			      .then(data => {
                window.localStorage.setItem('name', data.name)
                window.localStorage.setItem('playerId', data._id)
                window.location.reload()
            })
            .catch(err => console.log(err));
	});

}


export const loginForm = () => {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = '' +
		'<form id="login-form">' +
		'   <h1>Login to start:</h1>' +
		'   <input id="name" type="text" placeholder="Enter a name"/>' +
		'   <input id="password" type="password" placeholder="Enter your password..."/>' +
		'   <button class="btn-block" type="submit">Login</button>' +
		'</form>';
	  const root = document.getElementById('root')
    // root.innerHTML = ''
    root.appendChild(formContainer)

	  const form = document.getElementById('login-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the form from sending a request
		    const name = document.getElementById('name');
		    const password = document.getElementById('password');

        fetch('/api/auth/login', {
			      method: 'POST',
			      body: JSON.stringify({
				        "name": name.value,
				        "password": password.value
			      }),
			      headers: {
				        'Content-Type': 'application/json',
			      }
        })
            .then(res => res.json())
			      .then(data => {
                console.log(data)
                window.localStorage.setItem('name', data.name)
                window.localStorage.setItem('playerId', data._id)
                window.location.reload()
            })
            .catch(err => console.log(err));
	});

}

const saveSessionData = (session) => {
	window.localStorage.setItem("player_name", session.player_name);
	window.localStorage.setItem("player_id", session.player_id);
	window.localStorage.setItem("session_id", session._id);
	window.localStorage.setItem("session_name", session.name);
	window.localStorage.setItem("map_id", session.gameMap);
	console.log(session);
	window.location.reload();
}
