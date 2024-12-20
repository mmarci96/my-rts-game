from flask import Blueprint, render_template, request, redirect, sessions, url_for, session, jsonify, g
from bson import ObjectId
from datetime import datetime

from app.service.random_map_generator import generate_random_map
from app.service.starter_unit_generator import create_units

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
            "status": "waiting",
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

@game_bp.route('/lobby-data/<game_id>', methods=['GET'])
def lobby_data(game_id):
    mongo = g.mongo
    game = mongo.db.games.find_one({"_id": ObjectId(game_id)})
    players = game['players']
    
    # Check if all players are ready
    all_ready = all(player["isReady"] for player in players)

    update_data = []
    for player in players:
        update_data.append({
            "username": player["username"],
            "userId": str(player["userId"]),  # Convert ObjectId to string
            "color": player["color"],
            "isReady": player["isReady"]
        })

    return jsonify(players=update_data, allReady=all_ready)

@game_bp.route('/start', methods=['POST'])
def start():

    mongo = g.mongo
    
    username = session["username"]
    user = mongo.db.users.find_one({"username": username})
    user_id = user["_id"]

    game_id = request.form['game_id']
    game = mongo.db.games.find_one({"_id": ObjectId(game_id)})
    
    colors = []
    for p in game["players"]:
        colors.append(p["color"])

    map = generate_random_map(game["mapSize"])
    game_map = {
            "type": "random_map",
            "tiles": map,
            "size": game["mapSize"],
        }

    units = create_units(len(map), colors)
    game_session = {
            "units": units,
            "updatedAt": datetime.now(),
            "createdAt": datetime.now(),
            }
    
    map_id = mongo.db.maps.insert_one(game_map).inserted_id
    session_id = mongo.db.sessions.insert_one(game_session).inserted_id

    mongo.db.games.update_one(
        { "_id": ObjectId(game["_id"])},
        { "$set": { 
                    "mapId": ObjectId(map_id) ,
                    "sessionId": ObjectId(session_id) 
                }
        }
    )
    connection_url = "http://localhost:5173/play/"


    return jsonify(game_id=str(game_id), url_prefix=connection_url, user_id=str(user_id))


