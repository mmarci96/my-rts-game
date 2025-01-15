from flask import Blueprint, render_template, request, redirect, url_for, flash, session, g
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

@auth_bp.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirm_password = request.form.get("confirm_password")
        
        if not password:
            flash("Password is required!", "danger")
            return redirect(url_for("auth.register"))

        if password != confirm_password:
            flash("Passwords do not match!", "danger")
            return redirect(url_for("auth.register"))

        mongo = g.mongo
        if mongo.db.users.find_one({"username": username}):
            flash("Username already exists!", "danger")
            return redirect(url_for("auth.register"))

        hashed_password = generate_password_hash(password)
        mongo.db.users.insert_one({"username": username, "password": hashed_password})
        
        flash("Registration successful! Please log in.", "success")
        return redirect(url_for("auth.login"))

    return render_template("register.html")


@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password") 
        
        if not password:
            flash("Password is required!", "danger")
            return redirect(url_for("auth.register"))

        mongo = g.mongo
        
        user = mongo.db.users.find_one({"username": username})
        
        if user and check_password_hash(user["password"], password):
            session["username"] = username
            flash("Login successful!", "success")
            return redirect(url_for("home.home"))
        else:
            flash("Invalid username or password!", "danger")
            return redirect(url_for("auth.login"))

    return render_template("login.html")


@auth_bp.route("/logout")
def logout():
    session.pop("username", None)
    flash("You have been logged out.", "success")
    return redirect(url_for("auth.login"))

