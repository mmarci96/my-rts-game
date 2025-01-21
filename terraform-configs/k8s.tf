
resource "kubernetes_deployment" "rts_game_flask_app" {
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
          image = "${aws_ecr_repository.repositories["rts-game-flask-ecr"].repository_url}:latest"

          env {
            name  = "MONGO_URI"
            value = var.mongobd-uri-value
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

