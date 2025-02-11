# My RTS game

![GitHub repo size](https://img.shields.io/github/repo-size/mmarci96/my-rts-game?style=for-the-badge)
![GitHub contributors](https://img.shields.io/github/contributors/mmarci96/my-rts-game?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/mmarci96/my-rts-game?style=for-the-badge)
![GitHub license](https://img.shields.io/github/license/mmarci96/my-rts-game?style=for-the-badge)


## Overview

I aim to create a game where you can do what in most RTS game. I wanted to understand animations and websockets, as well attemting to write the code that animation frameworks or game engines abstract aways from the developer. I assembled my stack accordingly:

### GameUI
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-FFD129?style=for-the-badge&logo=vite&logoColor=64A5FF)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)

Created animations to display the game and UI for the user to command units to move, attack and die.

### Server
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) 
![Socket.io](https://img.shields.io/badge/Socket.io-2496ED?style=for-the-badge&logo=socket.io&logoColor=white)

Connects players to websocket and starts the game loop loading the state from the db as well as saving it regularly, stopping the game on disconnect.
Planning to upgrade to Redis to share the game's state instead of Js OOP.

### Website 
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Python](https://img.shields.io/badge/Python-232F3E?style=for-the-badge&logo=python&logoColor=326CE5)

Python offers many great libraries for development. This project I wanted to implement random map creation with Perlim noise. Since I found this in Python I just made the webapp for game lobbies and potentially leaderboars in the future.

### Database 
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
MongoDB is quick for development. Mongoose gives some type safety for experimantal development.

### Deployment
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-623CE4?style=for-the-badge&logo=terraform&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)

Deployment is automated with Terraform, which pulls the latest updates, builds Docker images, and provisions AWS resources. Once the EKS cluster is ready, Kubernetes manages deployment and ensures high availability of the game servers.

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
