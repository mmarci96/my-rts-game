#!/bin/bash

# Function to check OS
get_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "mac"
    else
        echo "unknown"
    fi
}

# Start MongoDB in the background using Docker
start_mongo() {
    echo "Starting MongoDB with Docker..."
    cd mongo-db-local || exit
    docker-compose up --build -d
    cd .. || exit
}

# Function to open a terminal and run commands (based on OS)
open_terminal() {
    local command="$1"
    local os=$(get_os)

    if [[ "$os" == "mac" ]]; then
        # For macOS, use the default terminal (`Terminal.app`)
        osascript -e "tell application \"Terminal\" to do script \"$command\""
    elif [[ "$os" == "linux" ]]; then
        # For Linux, try using gnome-terminal or fallback to the default terminal
        gnome-terminal -- bash -c "$command"
    else
        echo "Unsupported OS!"
        exit 1
    fi
}

# Install and run client
start_client() {
    open_terminal "cd client && npm install && npm run dev"
}

# Install and run game server
start_game_server() {
    open_terminal "cd game-server && npm install && npm run dev"
}

# Install and run flask backend
start_flask_backend() {
    open_terminal "cd flask-htmx && source venv/bin/activate && pip install -r requirements.txt && python run.py"
}

# Main function to orchestrate everything
main() {
    # Step 1: Start MongoDB
    start_mongo

  # Step 2: Start Client in a new terminal
  start_client

  # Step 3: Start Game Server in a new terminal
  start_game_server

  # Step 4: Start Flask Backend in a new terminal
  start_flask_backend

  echo "All processes have been started."
}

# Execute the main function
main

