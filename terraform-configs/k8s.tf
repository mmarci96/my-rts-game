provider "kubernetes" {
  config_path = "~/.kube/config"
}

resource "kubernetes_deployment" "rts_game_flask_app" {

  depends_on = [module.eks]
  metadata {
    name      = "rts-game-flask-app"
    namespace = "default"
    labels = {
      app = "rts-game-flask-app"
    }
  }

  spec {
    selector {
      match_labels = {
        app = "rts-game-flask-app"
      }
    }

    template {
      metadata {
        labels = {
          app = "rts-game-flask-app"
        }
      }

      spec {
        container {
          name  = "rts-game-flask-app"
          image = "${aws_ecr_repository.repositories["flask-app"].repository_url}:latest"
          env {
            name  = "MONGO_URI"
            value = var.mongodb-uri-value
          }
          env {
            name  = "SECRET_KEY"
            value = var.secret-key-value
          }

          resources {
            requests = {
              memory = "128Mi"
              cpu    = "250m"
            }
            limits = {
              memory = "256Mi"
              cpu    = "500m"
            }
          }

          readiness_probe {
            http_get {
              path = "/home/health"
              port = 5000
            }
            initial_delay_seconds = 5
            period_seconds        = 10
          }

          liveness_probe {
            http_get {
              path = "/home/health"
              port = 5000
            }
            initial_delay_seconds = 10
            period_seconds        = 20
          }
        }
      }
    }
  }
}
resource "kubernetes_service" "rts_game_flask_app" {
  depends_on = [module.eks]
  metadata {
    name      = "rts-game-flask-app"
    namespace = "default"
  }

  spec {
    selector = {
      app = "rts-game-flask-app"
    }

    port {
      protocol    = "TCP"
      port        = 5000
      target_port = 5000
    }

    type = "ClusterIP"
  }
}

resource "kubernetes_deployment" "rts_game_client" {
  depends_on = [module.eks]
  metadata {
    name      = "rts-game-client"
    namespace = "default"
    labels = {
      app = "rts-game-client"
    }
  }

  spec {
    selector {
      match_labels = {
        app = "rts-game-client"
      }
    }

    template {
      metadata {
        labels = {
          app = "rts-game-client"
        }
      }

      spec {
        container {
          name  = "rts-game-client"
          image = "${aws_ecr_repository.repositories["client"].repository_url}:latest"

          resources {
            requests = {
              cpu    = "250m"
              memory = "256Mi"
            }
            limits = {
              cpu    = "500m"
              memory = "500Mi"
            }
          }

          port {
            container_port = 80
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "rts_game_client" {
  depends_on = [module.eks]
  metadata {
    name      = "rts-game-client"
    namespace = "default"
  }

  spec {
    selector = {
      app = "rts-game-client"
    }

    port {
      protocol    = "TCP"
      port        = 80
      target_port = 80
    }

    type = "LoadBalancer"
  }
}


resource "kubernetes_deployment" "rts_game_server" {
  depends_on = [module.eks]
  metadata {
    name      = "rts-game-server"
    namespace = "default"
    labels = {
      app = "rts-game-server"
    }
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "rts-game-server"
      }
    }

    template {
      metadata {
        labels = {
          app = "rts-game-server"
        }
      }

      spec {
        container {
          name  = "rts-game-server"
          image = "${aws_ecr_repository.repositories["game-server"].repository_url}:latest"

          env {
            name  = "MONGO_URI"
            value = var.mongodb-uri-value
          }

          resources {
            requests = {
              cpu    = "1"
              memory = "500Mi"
            }
            limits = {
              cpu    = "2"
              memory = "1Gi"
            }
          }

          port {
            container_port = 8080
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "rts_game_server" {
  depends_on = [module.eks]
  metadata {
    name      = "rts-game-server"
    namespace = "default"
  }

  spec {
    selector = {
      app = "rts-game-server"
    }

    port {
      protocol    = "TCP"
      port        = 8080
      target_port = 8080
    }

    type = "ClusterIP"
  }
}
