# My RTS game
![GitHub repo size](https://img.shields.io/github/repo-size/mmarci96/my-rts-game?style=for-the-badge)
![GitHub contributors](https://img.shields.io/github/contributors/mmarci96/my-rts-game?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/mmarci96/my-rts-game?style=for-the-badge)
![GitHub license](https://img.shields.io/github/license/mmarci96/my-rts-game?style=for-the-badge)

## [![Table-Of-Content](https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&weight=600&size=24&pause=1000&width=435&lines=Table+of+Content)](https://git.io/typing-svg)

<div align="block">
<a href="#overview"><kbd>Overview</kbd></a>&ensp;&ensp;
<a href="#quick-start"><kbd>Quick Start</kbd></a>&ensp;&ensp;
<a href="#technologies"><kbd>Technologies</kbd></a>&ensp;&ensp;
<a href="#objectives"><kbd>Objectives</kbd></a>&ensp;&ensp;
<a href="#deployment"><kbd>Deployment</kbd></a>&ensp;&ensp;
<a href="#art"><kbd> Art </kbd></a>&ensp;&ensp;
</div>

## [![overview](https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&weight=600&size=24&pause=9000&width=435&lines=Overview)](https://git.io/typing-svg)


#### I aim to create a game where you can do what in most RTS game. I choose isometric view to display the game to give some depth. The game easy to setup in Docker composer but if you can host your frontend on dev run and unblock the firewall you can play together. You can give commands to your units to move or attack after you select them.
The project is still in development and currently buildings appear on the map and you can select and see available commands its not tested and implemented yet.
#### The last player with available units win the game simple as that. On local network I had to refresh the page sometimes.

## [![quick-start](https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&weight=600&size=24&pause=3000&width=435&lines=Quick+Start)](https://git.io/typing-svg)  

To quickly setup the whole environment you can just setup your env variables and build and start the application on you localhost with a single command. To make the game available on your local host you might have to implement extra steps depending on the os you are using.

```
git clone https://github.com/mmarci96/my-rts-game.git
cd my-rts-game
cp sample.env .env
docker-compose up --build -d
```
To create a new session for the game and be able to play against yourself as a demo run you might have to run another browser or session.

## [![technologies](https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&weight=600&size=24&pause=8000&width=435&lines=Technologies)](https://git.io/typing-svg)

![GameUI](https://img.shields.io/badge/GameUI-000000?style=for-the-badge&logo=gameui&logoColor=white) 
![Javascript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) 
![Vite](https://img.shields.io/badge/Vite-FFD129?style=for-the-badge&logo=vite&logoColor=64A5FF) 
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
#### Created animations to display the game and UI for the user to command units to move, attack and die.

---
![Server](https://img.shields.io/badge/Server-000000?style=for-the-badge&logo=server&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-2496ED?style=for-the-badge&logo=socket.io&logoColor=white)

#### Connects players to websocket and starts the game loop loading the state from the db as well as saving it regularly, stopping the game on disconnect.
Planning to upgrade to Redis to share the game's state instead of Js OOP.

---
![Website](https://img.shields.io/badge/Website-000000?style=for-the-badge&logo=website&logoColor=white)
![Python](https://img.shields.io/badge/Python-232F3E?style=for-the-badge&logo=python&logoColor=326CE5)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)

#### Python offers many great libraries for development. This project I wanted to implement random map creation with Perlim noise. Since I found this in Python I just made the webapp for game lobbies and potentially leaderboars in the future.

---
![Database](https://img.shields.io/badge/Database-000000?style=for-the-badge&logo=database&logoColor=white) 
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

#### MongoDB is quick for development. Mongoose gives some type safety for experimantal development.

---
![Deployment](https://img.shields.io/badge/Deployment-000000?style=for-the-badge&logo=deployment&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white) 
![Terraform](https://img.shields.io/badge/Terraform-623CE4?style=for-the-badge&logo=terraform&logoColor=white) 
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)

#### Deployment is automated with Terraform, which pulls the latest updates, builds Docker images, and provisions AWS resources. Once the EKS cluster is ready, Kubernetes manages deployment and ensures high availability of the game servers.

<div align="center"><table><tr>General setup</tr><tr><td>
<img src="https://raw.githubusercontent.com/mmarci96/my-rts-game/development/general-setup.png" 
             style="border-radius: 16px; border-style: solid; border-width: 1px; border-color: #5C81CE; margin: 8px;"/></td><td>
</table></div>



## [![objectives](https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&weight=600&size=24&pause=4000&width=435&lines=Objectives)](https://git.io/typing-svg)
#### The game should be doing what a you expect from an oldschool RTS like Dune2000, AoE, Warcraft, Starcraft.
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

## [![Deployment](https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&weight=600&size=24&pause=6000&width=435&lines=Deployment)](https://git.io/typing-svg)
Most of my config has many default variables. 

At this point I left the issue unresolved when running ```terraform plan``` , ```terraforn apply``` after init or after destroy setting up Kubernetes will not find the eks.
You need to load the Kube config ```aws eks --region <region> update-kubeconfig --name <cluster-name>``` as I found as the easiest way to leave it since many experiment failed for now. After that ```terraform plan``` && ```terraform apply``` should set up the cluster to serve the game with AWS.

---

## [![Art](https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&weight=600&size=24&pause=9000&width=435&lines=Art)](https://git.io/typing-svg)
A huge thanks to Pixelfrog for their amazing free game assets! Their pixel art brings my game to life.
You can check out more of their work here
#### Artist: Pixelfrog - Click below:
<a href="https://pixelfrog-assets.itch.io"> ![ichdotio](https://img.shields.io/badge/Itch.io-FA5C5C?style=for-the-badge&logo=itchdotio&logoColor=white)
<img src="https://img.itch.zone/aW1nLzEwNDkxNTQ1LmdpZg==/original/k%2BhWls.gif"
style="border-radius: 16px; border-style: solid; border-width: 1px; border-color: #5C81CE; margin: 8px;"/>
</a>

