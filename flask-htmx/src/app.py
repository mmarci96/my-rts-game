from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "default_secret_key")  # Replace with a strong key for production

# MongoDB configuration
app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb://localhost:27017/mydatabase")
mongo = PyMongo(app)

# Routes
@app.route("/")
def home():
    if "username" in session:
        return render_template("home.html", username=session["username"])
    return redirect(url_for("login"))

@app.route('/create-game', methods=['GET', 'POST'])
def create_game():
    if request.method == 'POST':
        username=session["username"]
        user = mongo.db.users.find_one({"username": username})
        user_id = user["_id"]        

        game_name = request.form['game_name']
        map_size = request.form['map_size']
        max_players = int(request.form['max_players'])

        # Create a new game in the database
        game = {
            "name": game_name,
            "owner": user_id,
            "mapSize": map_size,
            "maxPlayers": max_players,
            "players": [],
            "status": "waiting"
        }
        game_id = mongo.db.games.insert_one(game).inserted_id

        return redirect(url_for('lobby', game_id=game_id))
    return render_template('create_game.html')

@app.route('/join-game', methods=['GET', 'POST'])
def join_game():
    if request.method == 'POST':
        game_id = request.form['game_id']
        return redirect(url_for('lobby', game_id=game_id))
    # Fetch all active games
    games = mongo.db.games.find({"status": "waiting"})
    return render_template('join_game.html', games=games)

@app.route('/lobby/<game_id>', methods=['GET', 'POST'])
def lobby(game_id):
    game = mongo.db.games.find_one({"_id": ObjectId(game_id)})

    if request.method == 'POST':
        player_color = request.form['color']
        username=session["username"]
        user = mongo.db.users.find_one({"username": username})
        user_id = user["_id"]        

        # Add the player to the game
        player = {
            "userId": user_id,
            "color": player_color,
            "isReady": False
        }

        mongo.db.games.update_one(
            {"_id": ObjectId(game_id)},
            {"$push": {"players": player}}
        )

        return redirect(url_for('lobby', game_id=game_id))

    # Display the players and game info
    players = game['players']
    return render_template('lobby.html', game=game, players=players)

@app.route('/update-player-status/<game_id>', methods=['POST'])
def update_player_status(game_id):
    username=session["username"]
    user = mongo.db.users.find_one({"username": username})
    user_id = user["_id"]        

    game = mongo.db.games.find_one({"_id": ObjectId(game_id)})
    
    # Find the player in the game by their color
    player = next((p for p in game['players'] if p['userId'] == user_id), None)
    
    if player:
        # Toggle the player's ready status
        new_status = not player['isReady']
        
        # Update the ready status in the game documen t
        mongo.db.games.update_one(
            {"_id": ObjectId(game_id), "players.userId": user_id },
            {"$set": {"players.$.isReady": new_status } }
        )

    return redirect(url_for('lobby', game_id=game_id))

@app.route('/leave-game/<game_id>', methods=['POST'])
def leave_game(game_id):
    username=session["username"]
    user = mongo.db.users.find_one({"username": username})
    user_id = user["_id"]

    mongo.db.games.update_one(
        {"_id": ObjectId(game_id)},
        {"$pull": {"players": {"userId": user_id }}}
    )
    return redirect(url_for('home'))


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        # Get form data
        username = request.form.get("username")
        password = request.form.get("password")
        confirm_password = request.form.get("confirm_password")
        
        # Check for matching passwords
        if password != confirm_password:
            flash("Passwords do not match!", "danger")
            return redirect(url_for("register"))

        # Check if user already exists
        if mongo.db.users.find_one({"username": username}):
            flash("Username already exists!", "danger")
            return redirect(url_for("register"))

        # Hash password and save to database
        hashed_password = generate_password_hash(password)
        mongo.db.users.insert_one({"username": username, "password": hashed_password})
        
        flash("Registration successful! Please log in.", "success")
        return redirect(url_for("login"))

    return render_template("register.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        # Get form data
        username = request.form.get("username")
        password = request.form.get("password")
        
        # Find user in database
        user = mongo.db.users.find_one({"username": username})
        
        if user and check_password_hash(user["password"], password):
            session["username"] = username
            flash("Login successful!", "success")
            return redirect(url_for("home"))
        else:
            flash("Invalid username or password!", "danger")
            return redirect(url_for("login"))

    return render_template("login.html")

@app.route("/logout")
def logout():
    session.pop("username", None)
    flash("You have been logged out.", "success")
    return redirect(url_for("login"))

# Main
if __name__ == "__main__":
    app.run(debug=True)

