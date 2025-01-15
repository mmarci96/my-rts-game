from flask import Blueprint, render_template, request, redirect, g
import os
from app.service.random_map_generator import create_map_with_params

map_bp = Blueprint('map', __name__)


@map_bp.route('/create-map', methods=['GET', 'POST'])
def create_map():
    if request.method == 'POST':
        mongo = g.mongo

        # Get form inputs
        map_name = request.form['map_name']
        map_size = request.form['map_size']
        scale = float(request.form['scale'])  # Decimal value for scale
        octaves = int(request.form['octaves'])  # Integer value for octaves
        persistence = float(request.form['persistence'])  # Decimal value for persistence
        lacunarity = float(request.form['lacunarity'])  # Decimal value for lacunarity

        # Call the map generation function with parameters
        map_data = create_map_with_params(map_size, scale, octaves, persistence, lacunarity)

        # Save the map to the database
        game_map = {
            "type": map_name,
            "tiles": map_data,
            "size": map_size,
        }
        map_id = mongo.db.maps.insert_one(game_map).inserted_id

        mongo_uri = os.getenv("MONGO_URI", "local")

        # Redirect to the map's URL
        map_url = f"http://localhost/mapview/{map_id}"
        if mongo_uri == 'local':
            map_url = f"http://localhost:5173/mapview/{map_id}"
        
        return redirect(map_url)

    # Render the map creation form
    return render_template('create_map.html')

