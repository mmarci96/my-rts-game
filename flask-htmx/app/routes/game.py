from flask import Blueprint, render_template, request, redirect, url_for, session, current_app, g
from bson import ObjectId

game_bp = Blueprint('game', __name__)

@game_bp.route('/create-game', methods=['GET', 'POST'])
def create_game():
    if request.method == 'POST':
        mongo = g.mongo 
        username = session["username"]
        user = mongo.db.users.find_one({"username": username})
        user_id = user["_id"]

        game_name = request.form['game_name']
        map_size = request.form['map_size']
        max_players = int(request.form['max_players'])

        game = {
            "name": game_name,
            "owner": user_id,
            "mapSize": map_size,
            "maxPlayers": max_players,
            "players": [],
            "status": "waiting"
        }
        game_id = mongo.db.games.insert_one(game).inserted_id

        return redirect(url_for('game.lobby', game_id=game_id))
    return render_template('create_game.html')


@game_bp.route('/join-game', methods=['GET', 'POST'])
def join_game():
    if request.method == 'POST':
        game_id = request.form['game_id']
        return redirect(url_for('game.lobby', game_id=game_id))
        
    mongo = g.mongo 
    games = mongo.db.games.find({"status": "waiting"})
    return render_template('join_game.html', games=games)


@game_bp.route('/lobby/<game_id>', methods=['GET', 'POST'])
def lobby(game_id):
    mongo = g.mongo 
    game = mongo.db.games.find_one({"_id": ObjectId(game_id)})

    if request.method == 'POST':
        player_color = request.form['color']
        username = session["username"]
        user = mongo.db.users.find_one({"username": username})
        user_id = user["_id"]
        player = {
            "username": username,
            "userId": user_id,
            "color": player_color,
            "isReady": False 
        }

        mongo.db.games.update_one(
            {"_id": ObjectId(game_id)},
            {"$push": {"players": player}}
        )

        return redirect(url_for('game.lobby', game_id=game_id))

    players = game['players']
    return render_template('lobby.html', game=game, players=players)


@game_bp.route('/update-player-status/<game_id>', methods=['POST'])
def update_player_status(game_id):
    mongo = g.mongo 
    username = session["username"]
    user = mongo.db.users.find_one({"username": username})
    user_id = user["_id"]

    game = mongo.db.games.find_one({"_id": ObjectId(game_id)})

    player = next((p for p in game['players'] if p['userId'] == user_id), None)

    if player:
        new_status = not player['isReady']

        mongo.db.games.update_one(
            {"_id": ObjectId(game_id), "players.userId": user_id},
            {"$set": {"players.$.isReady": new_status}}
        )

    return redirect(url_for('game.lobby', game_id=game_id))


@game_bp.route('/leave-game/<game_id>', methods=['POST'])
def leave_game(game_id):
    username = session["username"]
    mongo = g.mongo 
    user = mongo.db.users.find_one({"username": username})
    user_id = user["_id"]

    mongo.db.games.update_one(
        {"_id": ObjectId(game_id)},
        {"$pull": {"players": {"userId": user_id}}}
    )
    return redirect(url_for('home.home'))

