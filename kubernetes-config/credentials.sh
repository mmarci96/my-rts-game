#!/bin/bash

# File path
env_file=".env"

# Default values if .env file exists
if [ -f "$env_file" ]; then
    # Extract mongo-user and mongo-password from .env file
    mongo_user=$(grep -oP '(?<=^mongo-user=).*' "$env_file")
    mongo_password=$(grep -oP '(?<=^mongo-password=).*' "$env_file")

    # Show the last 4 characters of the existing values as defaults
    if [ -n "$mongo_user" ]; then
        default_user="${mongo_user: -4}"
        echo "Current Mongo Username (last 4 chars): $default_user"
    fi

    if [ -n "$mongo_password" ]; then
        default_pass="${mongo_password: -4}"
        echo "Current Mongo Password (last 4 chars): $default_pass"
    fi
fi

# Ask for new MongoDB username, using the default value if exists
read -p "Enter Mongo Username (default: ${default_user:-your-username}): " mongo_user_input
mongo_user_input="${mongo_user_input:-$mongo_user}"

# Ask for new MongoDB password, using the default value if exists
read -sp "Enter Mongo Password (default: ${default_pass:-your-password}): " mongo_pass_input
echo
mongo_pass_input="${mongo_pass_input:-$mongo_password}"

# Save the values to .env file
echo "mongo-user=$mongo_user_input" > "$env_file"
echo "mongo-password=$mongo_pass_input" >> "$env_file"

echo ".env file created/updated with Mongo credentials."

