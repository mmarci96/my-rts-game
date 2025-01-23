from flask import Blueprint, jsonify, render_template, redirect, url_for, session

home_bp = Blueprint('home', __name__)

@home_bp.route("/")
def home():
    if "username" in session:
        return render_template("home.html", username=session["username"])
    return redirect(url_for("auth.login"))

@home_bp.route("/health")
def health():
    return jsonify({"status": "healthy"}), 200

