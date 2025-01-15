def create_units(size, colors):
    start_x = 0
    start_y = 0
    units = []

    for color in colors:
        if color == 'red':
            start_x = 6
            start_y = 5
        elif color == 'blue':
            start_x = size - 8
            start_y = size - 8
        elif color == 'yellow':
            start_y = size - 8
            start_x = 8
        elif color == 'purple':
            start_x = size - 8
            start_y = 6
        
        worker = {
                "x": start_x,
                "y": start_y,
                "color": color,
                "state": "idle",
                "health": 10,
                "speed": 4,
                "type": "worker"
                }
        units.append(worker)
        warrior = {
                "x": start_x+3,
                "y": start_y+3,
                "color": color,
                "state": "idle",
                "health": 16,
                "speed": 8,
                "type": "warrior"
                }
        units.append(warrior)

    return units


