# my-rts-game
## Overview
After feeling the pain of writing a game from scratch in Java, then experienced the boredom of creating one in Unity, I left unsatisfied.
So I decided to make an RTS game without the least amount of framework (especially the UI).
Techs I had to use so far: NodeJS, Vite, Express, Socketio, Docker, Git, Nginx.
Things I added for fun: Flask, MongoDB, Terraform, Kubernetes.

## Objectives
The game should be doing what a you expect from an oldschool RTS like Dune2000, AoE, Warcraft, Starcraft.
Requiremens:
 - Play online []
 - Mine resources [x]
 - Make units [x]
 - Make buildings [x]
 - Attack enemies []
 - Pathfinding [x]
 - Win a game []
Optional:
 - Make it ready to deploy []
 - Make it ready to scale [x]
 - Make it fun [x] :c
 - Fog of war [x]
 - Variety of units: Meele [] | Ranged [x] | AOE/Projectile User [x] | Healer [x] | Carrier [x]
 - Using OOP principles [~]

## Setup - Technologies and Decisions
The whole stack for now consists of 4 main components: Game - the UI to display the game, Website - to create the games, Server - to connect users,  Database - to store states and connect services reliably.

#### Game - NodeJs, Vite, Nginx
I also wanted to make my own animations but it was a pleasant surprise to find all the built in api-s in Javascript. I'm using the canvas element 2d context and its built in methods to paint the game map while transforming the games x,y,z coordinates to and isometric view for a more interesting user experience. Running a loop to make the animations smooth by requesting the frame rate. 
The ui should only display data from the server and should not have any controll on how fast or strong the units are to prevent people from cheating by simplye editing the games code in their browser.
To actually run the game and to enjoy fast refresh I used vite to build my image and the serving it statically from an Nginx image I build with docker serving as a reverse proxy to connect players to the websocket server.

#### Website - Python, Flask
I was not aiming for anything fancy here and I wanted to leave my native server not to serve more purpose then running the gamelogic itself (more on that later...). So after using React for everything I wanted to take it easy and learn another simple way of doing things when the website is just a way to connect the users to setup the game. For now it server static html files with some rendered content from the users and the database states. Many of the validations when making a lobby are poorly designed and can lead to error when a user is either fueled by harmful thoughts or not understanding my thoughts behind it.
Inside the gamelobby there are some js scripts to request lobby updates when being in one making the Play button only available when both players made their status ready to go.
To create the map for now I use a fixed perlim noise, but its ready to be set up with custom parameters loading in randomly to make the game map feel curvy.
Then the code also stores the default setup states of the games itslef. 

#### Server - NodeJs, Express, Socket-io
To make my junior life easy I decided to make the server and the games logic in the language I used the most. I did not have my mind on scaling since my project was aiming to create the engine to display the game, and write the logics to pathfinding, obsticle behaivors, clumped units or just in general the annoying part of making a game.
To connect users I at point felt like I had to use Socketio. It makes easy to reconnect users, add new streams quickly, better error messeges, converting to js from json.
The game itself is written in following some and braking other OOP principles. The focus so far was on making a game to connect and give commands or recieve updates.
As I add more logic to the game it is falling into those desing patterns naturally while showing me a great example.

#### Database - MongoDB
For development working with Js MongoDb is a solid choice making validations with the treesitter in my development environment makes changing things fast quick and easy.
I use it to save all my game states so it can be reloaded quickly if the game disconnects or just connected the actual states between my services in general.

Since the game itself was the challenge the db worth no debate.

## Quick Start - Docker on localhost

To quickly setup the whole environment you can just setup your env variables and build and start the application on you localhost with a single command. To make the game available on your local host you might have to implement extra steps depending on the os you are using.

  ```
    git clone https://github.com/mmarci96/my-rts-game.git
    cd my-rts-game
    cp sample.env .env
    docker-compose up --build -d
  ```
To create a new session for the game and be able to play against yourself as a demo run you might have to run another browser or session.

## Deployment
