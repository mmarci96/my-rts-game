from flask import Blueprint, render_template, request, redirect, url_for, session, jsonify, g
from datetime import datetime
from bson import ObjectId
import os

from app.service.random_map_generator import generate_random_map
from app.service.starter_data_generator import create_units, create_buildings, create_wheat_fields

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

        # Check if color is already taken
        if any(player['color'] == player_color for player in game['players']):
            return redirect(url_for('game.lobby', game_id=game_id))

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
    taken_colors = {player['color'] for player in players}
    available_colors = ["red", "blue", "yellow", "purple"]
    available_colors = [color for color in available_colors if color not in taken_colors]

    return render_template('lobby.html', game=game, players=players, available_colors=available_colors)

@game_bp.route('/lobby-stream/<game_id>', methods=['GET'])
def lobby_stream(game_id):
        mongo = g.mongo
        game = mongo.db.games.find_one({"_id": ObjectId(game_id)})
        players = game['players']

        all_ready = all(player["isReady"] for player in players)
        data = {
                "players": [{"username": p["username"], "color": p["color"], "isReady": p["isReady"]} for p in players],
                "allReady": all_ready,
                }
        return jsonify(data)

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

    # Fetch username and get user details from the session
    username = session["username"]
    user = mongo.db.users.find_one({"username": username})
    user_id = user["_id"]  # Correct user_id

    # Get the game details
    game_id = request.form['game_id']
    game = mongo.db.games.find_one({"_id": ObjectId(game_id)})

    # Verify all players are ready
    if not all(player['isReady'] for player in game['players']):
        return "Not all players are ready", 400

    # Ensure user_id is being used in the URL
    mongo_uri = os.getenv("MONGO_URI", "local")

    # Construct the connection URL with correct variables
    connection_url = f"/play/{game_id}/{user_id}" 


    if game['status'] != "waiting":
        # Perform redirect
        return redirect(connection_url)

    # If game status is "waiting", continue with game setup
    colors = [p["color"] for p in game["players"]]

    # Generate the map and game session
    game_map = {
        "type": "random_map",
        "tiles": generate_random_map(game["mapSize"]),
        "size": game["mapSize"],
    }

    game_session = {
        "units": [],
        "updatedAt": datetime.now(),
        "createdAt": datetime.now(),
    }

    # Create units and store them in the database
    units = create_units(len(game_map["tiles"]), colors)
    for unit in units:
        unit_id = mongo.db.units.insert_one(unit).inserted_id
        game_session["units"].append(unit_id)

    buildings = create_buildings(len(game_map["tiles"]), colors)
    for building in buildings:
        building_id = mongo.db.buildings.insert_one(building)
        game_session["buildings"].append(building_id)

    wheat_fields = create_wheat_fields(buildings)
    for wheat_field in wheat_fields:
        resource_id = mongo.db.resources.insert_one(wheat_field)
        game_session["resources"].append(resource_id)

    # Save the map and session
    map_id = mongo.db.maps.insert_one(game_map).inserted_id
    session_id = mongo.db.sessions.insert_one(game_session).inserted_id

    # Update the game status to "in-progress"
    mongo.db.games.update_one(
        {"_id": ObjectId(game["_id"])},
        {"$set": {
            "mapId": ObjectId(map_id),
            "sessionId": ObjectId(session_id),
            "status": "in-progress"
        }}
    )

    # Now redirect the user to the updated game page
    return redirect(connection_url)
