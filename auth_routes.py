from flask import Blueprint, request, jsonify
from supabase_client import supabase

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    # insert into users table
    response = supabase.table("users").insert({
        "name": name,
        "email": email,
        "password": password
    }).execute()

    return jsonify({"message": "User created", "user": response.data})

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    # find user by email
    response = supabase.table("users").select("*").eq("email", email).execute()

    if not response.data:
        return jsonify({"message": "User not found"}), 404

    user = response.data[0]

    if user["password"] != password:
        return jsonify({"message": "Invalid password"}), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"]
        }
    })
