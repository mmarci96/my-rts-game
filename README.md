# My RTS game

![GitHub repo size](https://img.shields.io/github/repo-size/mmarci96/my-rts-game?style=for-the-badge)
![GitHub contributors](https://img.shields.io/github/contributors/mmarci96/my-rts-game?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/mmarci96/my-rts-game?style=for-the-badge)
![GitHub license](https://img.shields.io/github/license/mmarci96/my-rts-game?style=for-the-badge)


## Overview
After feeling the pain of writing a game from scratch in Java, then experienced the boredom of creating one in Unity, I left unsatisfied.
So I decided to make an RTS game without the least amount of framework (especially the UI).
Techs I had to use so far: NodeJS, Vite, Express, Socketio, Docker, Git, Nginx.
Things I added for fun: Flask, MongoDB, Terraform, Kubernetes.

## Objectives
The game should be doing what a you expect from an oldschool RTS like Dune2000, AoE, Warcraft, Starcraft.
Requiremens:
 - Play online [✅]
 - Mine resources [x]
 - Make units [x]
 - Make buildings [x]
 - Attack enemies [✅]
 - Pathfinding [x]
 - Win a game [✅]
Optional:
 - Make it ready to deploy [✅]
 - Make it ready to scale [x]
 - Make it fun [x] :c
 - Fog of war [x]
 - Variety of units: Meele [✅] | Ranged [x] | AOE/Projectile User [x] | Healer [x] | Carrier [x]
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

---

## Deployment - Terraform, AWS, Kubernetes

I wanted to make the game ready to be deployed any time. Even if I end up deploying it on a VPS the setup will be proven useful as reference for setting up a local private network and running a kubernetes cluster.
Also I was learning and using this technology and I wanted to use anything I learned there to implement it on this project.

For loops were the first thing I had to wrap head around to understand and gave me a sense of control that "I will never ever have to write the same code twice after this!". But if your stack has more then one components building and deploying them feels like that once agan. With using terraform we can spin up a server build our newest image add to our repository on AWS. It also sets up the Amazon EKS with all the requirements of for kubernetes. 

Unfortunately I faced a pretty interesting issue with my code at this point...

### Scaling with NodeJs and Websockets
Since NodeJs by its very own nature is running as a single-threaded event loop scaling it has limitations without taking advantages of how Kubernetes offers replicas and loadbalancers. But since I store my games logic on the server and the states are being saved on some latency but the game logic itself is not that much ready for having replicas. I think I will offer a solution of this if I either implement Redis and share that between my nodes.
Since during the part I designed the game I was not thinking about this and I was doing my best to avoid using a technology I would not use. It was a nice experience on the client side so I thought "Redis is just a json" and went and wrote my own TypeError messeges. It should basically solve the need for users using the same server.
For the websockets if the game state doesn't matter anymore the Nginx config need to implement some policy and the Loadbalancer should handle them.

### Kubernetes inside the Terraform
Storing the Kubernetes configuration inside Terraform ensures version control, enables automation, and maintains infrastructure consistency across environments. I have only set it up with limited resources and I could not manage to get any real issue. Not sure how to simulate one but scaling would probably not be an issue if I spend time on scaling instead of making the game fun.

#### Environment - Terraform variables
Most of my config has many default variables. 

At this point I left the issue unresolved when running ```terraform plan``` , ```terraforn apply``` after init or after destroy setting up Kubernetes will not find the eks.
You need to load the Kube config ```aws eks --region <region> update-kubeconfig --name <cluster-name>``` as I found as the easiest way to leave it since many experiment failed for now. After that ```terraform plan``` && ```terraform apply``` should set up the cluster to serve the game with AWS.

---
