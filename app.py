from flask import Flask
from flask_cors import CORS

# import supabase client
from supabase_client import supabase

# import route blueprints
from routes.auth_routes import auth_bp
from routes.interview_routes import interview_bp   # ✅ NEW: Import the interview route

app = Flask(__name__)

# allow React frontend to communicate
CORS(app)

# register routes
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(interview_bp, url_prefix="/interview")  # ✅ NEW: Register the interview route


# ✅ Home route (test server) - (KEPT EXACTLY AS IT WAS)
@app.route("/")
def home():
    return {"message": "Backend running"}


# ✅ Database test route - (KEPT EXACTLY AS IT WAS)
@app.route("/test-db")
def test_db():
    data = supabase.table("users").select("*").execute()
    return {"data": data.data}


if __name__ == "__main__":
    app.run(debug=True)