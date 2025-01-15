import noise
import random

def create_map_with_params(size, scale, octaves, persistence, lacunarity):
    # Define size presets
    size_options = {
        "small": 64,
        "medium": 96,
        "large": 128
    }
    width = size_options.get(size, 64)  # Default to 'small' if size is invalid
    height = width  # Ensure square map

    # Define tile types I have way more...
    available_tiles = ['grass1', 'pavement1', 'pavement2', 'stone', 'stone2', 'water1']

    # Perlin noise parameters default params I used below and set up by listening to my heart<3
    # scale = 36.0  # Larger scale creates smoother transitions
    # octaves = 4
    # persistence = 0.5
    # lacunarity = 2.0

    map_data = []

    for i in range(height):
        row = []
        for j in range(width):
            # Generate Perlin noise value for (i, j)
            elevation = noise.pnoise2(
                i / scale,
                j / scale,
                octaves=octaves,
                persistence=persistence,
                lacunarity=lacunarity,
                repeatx=width,
                repeaty=height,
                base=42
            )
            
            # Map elevation to tile types
            # Again theese numbers are just set up completly by looking at the outputs
            if elevation < -0.15:  # More generous threshold for water
                tile_type = 'water1'
                z = -0.5  # Fixed z for water
            elif elevation >= -0.15:
                random_num = random.randrange(0, len(available_tiles)-1, 1)
                # On this threshold I just pick arandom tile from the available_tiles array
                tile_type = available_tiles[random_num]
                z = round(elevation, 2)
            elif elevation > -0.1:
                # This is the most generic looking so if we pass a threshold just make this
                tile_type = 'grass1'
                z = round(elevation, 2)
            else:
                # Im not sure we ever reach this but as a safety rule it wont hurt
                # Might wanna remove it if you understand the code or fine with creating map with holes
                tile_type = 'grass1'
                z = round(elevation, 2)

            # Since x and y will be represented by the index there is no need to store that data
            tile = {
                "z": z,
                "tile": tile_type
            }
            row.append(tile)
        map_data.append(row)

    # Printing the map here to check on terminal but I will create a client to check it how would look
    # print(map_data)
    # Ensure water tiles are grouped
    # that function was written by ai and seem right try commenting it out and see if it works even
    # group_water_tiles(map_data, width, height)
    return map_data



def get_neighbors(i, j, map_data, width, height):
    """Retrieve neighboring tiles of a given tile."""
    neighbors = []
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]  # Up, Down, Left, Right
    for di, dj in directions:
        ni, nj = i + di, j + dj
        if 0 <= ni < height and 0 <= nj < width:
            neighbors.append(map_data[ni][nj])
    return neighbors

def group_water_tiles(map_data, width, height):
    """Ensure water tiles are grouped together and not isolated."""
    for i in range(height):
        for j in range(width):
            tile = map_data[i][j]
            if tile['tile'] == 'water1':
                # Check neighbors and convert isolated tiles to 'grass1'
                neighbors = get_neighbors(i, j, map_data, width, height)
                if all(neighbor['tile'] != 'water1' for neighbor in neighbors):
                    tile['tile'] = 'grass1'
                    tile['z'] = 0.0  # Grass has neutral elevation


def generate_random_map(size):
    # Define size presets
    size_options = {
        "small": 64,
        "medium": 96,
        "large": 128
    }
    width = size_options.get(size, 64)  # Default to 'small' if size is invalid
    height = width  # Ensure square map

    # Define tile types
    available_tiles = ['grass1', 'pavement1', 'pavement2', 'stone', 'stone2', 'water1']

    # Perlin noise parameters
    scale = 36.0  # Larger scale creates smoother transitions
    octaves = 4
    persistence = 0.5
    lacunarity = 2.0

    map_data = []

    for i in range(height):
        row = []
        for j in range(width):
            # Generate Perlin noise value for (i, j)
            elevation = noise.pnoise2(
                i / scale,
                j / scale,
                octaves=octaves,
                persistence=persistence,
                lacunarity=lacunarity,
                repeatx=width,
                repeaty=height,
                base=42
            )
            
            # Map elevation to tile type
            if elevation < -0.15:  # More generous threshold for water
                tile_type = 'water1'
                z = -0.5  # Fixed z for water
            elif elevation >= -0.15:
                random_num = random.randrange(0, len(available_tiles)-1, 1)
                tile_type = available_tiles[random_num]
                z = round(elevation, 2)
            elif elevation > -0.1:
                tile_type = 'stone2'
                z = round(elevation, 2)
            else:
                tile_type = 'grass1'
                z = round(elevation, 2)

            tile = {
                "z": z,
                "tile": tile_type
            }
            row.append(tile)
        map_data.append(row)

    # Ensure water tiles are grouped
    group_water_tiles(map_data, width, height)
    return map_data

