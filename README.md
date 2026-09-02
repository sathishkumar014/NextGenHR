NextGen HR – AI-Powered Virtual Interviewer

NextGen HR is a full-stack AI-assisted virtual interview platform designed to help candidates practice interviews and receive automated performance feedback.

The application allows users to create an account, select an interview role, difficulty, and interview type, complete a structured interview, and receive an AI-generated evaluation with scores, strengths, improvement areas, and suggestions.

✨ Features
User signup and login
Interview setup by role, difficulty, and interview type
AI-generated interview questions using the Groq API
Fixed introductory question followed by generated follow-up questions
Interview question and session storage using Supabase
Automated response evaluation
Performance scores for:
Knowledge
Communication
Confidence
Emotion
Overall performance
AI-generated strengths, improvements, and personalized suggestions
Interview history and profile analytics
Responsive React-based user interface
Fallback question generation and evaluation when AI generation is unavailable
🏗️ Project Architecture
NextGen-HR/
├── backend/
│   ├── app.py
│   ├── models/
│   │   ├── audio_model.py
│   │   ├── text_model.py
│   │   └── video_model.py
│   ├── routes/
│   │   ├── auth_routes.py
│   │   ├── interview_routes.py
│   │   └── analysis_routes.py
│   ├── services/
│   │   ├── groq_service.py
│   │   ├── interview_service.py
│   │   └── vapi_service.py
│   ├── supabase_client.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
🛠️ Technology Stack
Frontend
React
TypeScript
Vite
React Router
Tailwind CSS
shadcn/ui / Radix UI
Recharts
Lucide React
Backend
Python
Flask
Flask-CORS
Gunicorn
AI & Services
Groq API
Llama models for interview question generation and response evaluation
Vapi Web SDK integration
Database
Supabase
Development Tools
Git / GitHub
VS Code
npm
Postman
🔄 How It Works
User
  │
  ▼
React Frontend
  │
  ├── Signup / Login
  │
  ├── Interview Setup
  │       │
  │       ▼
  │   Flask REST API
  │       │
  │       ├── Supabase → Store interview session
  │       │
  │       └── Groq API → Generate questions
  │
  ▼
Live Interview
  │
  ▼
Response Collection
  │
  ▼
Flask / Groq AI Analysis
  │
  ▼
Scores + Strengths + Improvements + Suggestions
  │
  ▼
Results & Profile Analytics
🚀 Getting Started
1. Clone the Repository
git clone https://github.com/<your-username>/NextGen-HR.git
cd NextGen-HR
2. Backend Setup

Move into the backend directory:

cd backend

Create a virtual environment:

python -m venv venv

Activate it on Windows:

venv\Scripts\activate

On macOS/Linux:

source venv/bin/activate

Install dependencies:

pip install -r requirements.txt
3. Configure Environment Variables

Create a .env file inside the backend directory:

GROQ_API_KEY=your_groq_api_key
GROQ_ANALYSIS_MODEL=llama-3.3-70b-versatile
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

Important: Never commit .env files or API keys to GitHub.

4. Start the Backend

From the backend directory:

python app.py
5. Frontend Setup

Open a new terminal:

cd frontend
npm install

Start the development server:

npm run dev

Vite will provide the local development URL in the terminal.

🔌 Main API Endpoints
Authentication
POST /auth/signup
POST /auth/login
Interviews
POST /interview/create
GET  /interview/questions/<interview_id>
GET  /interview/history/<user_id>
POST /interview/analyze
Health / Database Testing
GET /
GET /test-db
📊 AI Evaluation

The interview analysis service evaluates candidate answers across several dimensions:

Technical/knowledge clarity
Communication quality
Confidence and fluency
Emotional stability
Structure and relevance

The API returns a structured JSON response containing scores, strengths, improvements, and actionable suggestions.

If the Groq analysis request fails, the backend includes a fallback evaluation mechanism so that the application can still return a structured result.

🗄️ Data Storage

Supabase is used as the backend database service.

The backend interacts with tables including:

users
interviews
questions

Interview records can store information such as:

Role
Difficulty
Interview type
Overall score
Final feedback
🔐 Security Note

This project is intended for educational and portfolio purposes.

Before deploying it publicly, additional security improvements should be implemented, including:

Secure password hashing
Strong authentication and session management
Input validation
API rate limiting
Proper secret management
Production CORS configuration
Database Row Level Security (RLS)

Never upload API keys, passwords, Supabase secrets, or other credentials to the repository.

🎯 Project Objective

The goal of NextGen HR is to make interview preparation more accessible by providing an interactive environment where candidates can practice interviews and receive structured, AI-assisted feedback instead of relying only on manual evaluation.

👨‍💻 Project Team

Developed as an academic/final-year project.

Project: NextGen HR – AI-Powered Virtual Interviewer

📌 Future Improvements
Real-time voice interview support
More advanced audio and video analysis
Resume-based personalized questions
Job-description-based interview generation
Interview recording and playback
More detailed performance analytics
Role-specific evaluation models
Secure production authentication
