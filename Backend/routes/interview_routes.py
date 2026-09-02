from groq import Groq
import os
import json
import re
from flask import Blueprint, request, jsonify
from supabase_client import supabase
from services.groq_service import generate_interview_questions, INTRO_QUESTION


interview_bp = Blueprint("interview", __name__)
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
analysis_model = os.getenv("GROQ_ANALYSIS_MODEL", "llama-3.3-70b-versatile")
INTRO_QUESTION_KEY = re.sub(r"[^a-z0-9]+", "", INTRO_QUESTION.lower())


def _clamp_score(value, default=70):
    try:
        numeric_value = int(round(float(value)))
    except (TypeError, ValueError):
        numeric_value = default
    return max(0, min(100, numeric_value))


def _question_key(text):
    return re.sub(r"[^a-z0-9]+", "", str(text).lower())


def _is_intro_question(text):
    key = _question_key(text)
    if not key:
        return False
    return (
        key == INTRO_QUESTION_KEY
        or key.startswith("tellmeaboutyourself")
        or "tellmeaboutyourselfandyourbackground" in key
    )


def _sanitize_questions(questions):
    if not isinstance(questions, list):
        return [INTRO_QUESTION]

    unique_followups = []
    seen = set()

    for question in questions:
        if not isinstance(question, str):
            continue
        normalized = question.strip()
        if not normalized:
            continue
        if _is_intro_question(normalized):
            continue

        key = _question_key(normalized)
        if key in seen:
            continue

        seen.add(key)
        unique_followups.append(normalized)

    return [INTRO_QUESTION, *unique_followups]


def _fallback_analysis(answers):
    avg_length = 0
    if answers:
        avg_length = sum(len(answer.split()) for answer in answers) / len(answers)

    base_score = 65 if avg_length < 20 else 72 if avg_length < 40 else 80

    return {
        "scores": {
            "knowledge": _clamp_score(base_score + 3),
            "communication": _clamp_score(base_score),
            "confidence": _clamp_score(base_score - 2),
            "emotion": _clamp_score(base_score + 1),
            "overall": _clamp_score(base_score),
        },
        "strengths": [
            "Provided structured responses to multiple interview prompts.",
            "Maintained relevance to the questions asked.",
            "Demonstrated willingness to explain technical work.",
            "Showed consistent engagement across answers.",
        ],
        "improvements": [
            "Use more quantified outcomes and concrete examples.",
            "Keep answers concise while preserving clarity.",
            "Highlight leadership and collaboration moments.",
            "Add stronger closing summaries for key answers.",
        ],
        "suggestions": [
            {
                "title": "Use STAR Format",
                "description": "Frame behavioral responses with Situation, Task, Action, and Result.",
            },
            {
                "title": "Add Metrics",
                "description": "Include measurable impact like latency reductions or delivery improvements.",
            },
            {
                "title": "Practice Delivery",
                "description": "Rehearse answers aloud to improve clarity, confidence, and pacing.",
            },
        ],
    }


def _parse_analysis_json(text):
    cleaned_text = (text or "").replace("```json", "").replace("```", "").strip()
    if not cleaned_text:
        raise ValueError("Empty model response")

    try:
        return json.loads(cleaned_text)
    except json.JSONDecodeError:
        pass

    json_match = re.search(r"\{[\s\S]*\}", cleaned_text)
    if not json_match:
        raise ValueError("No JSON object found in response")

    return json.loads(json_match.group(0))


def _normalize_analysis_payload(payload, answers):
    fallback = _fallback_analysis(answers)
    scores = payload.get("scores", {}) if isinstance(payload, dict) else {}

    score_keys = ["knowledge", "communication", "confidence", "emotion", "overall"]
    numeric_scores = []
    for key in score_keys:
        value = scores.get(key) if isinstance(scores, dict) else None
        try:
            numeric_scores.append(float(value))
        except (TypeError, ValueError):
            continue

    # Some models return 1-10 scores even when asked for 0-100.
    if numeric_scores and max(numeric_scores) <= 10:
        scaled_scores = {}
        for key in score_keys:
            try:
                scaled_scores[key] = float(scores.get(key)) * 10
            except (TypeError, ValueError):
                scaled_scores[key] = scores.get(key)
        scores = scaled_scores

    strengths = payload.get("strengths") if isinstance(payload, dict) else None
    improvements = payload.get("improvements") if isinstance(payload, dict) else None
    suggestions = payload.get("suggestions") if isinstance(payload, dict) else None

    normalized_strengths = (
        [item for item in strengths if isinstance(item, str) and item.strip()]
        if isinstance(strengths, list)
        else fallback["strengths"]
    )
    normalized_improvements = (
        [item for item in improvements if isinstance(item, str) and item.strip()]
        if isinstance(improvements, list)
        else fallback["improvements"]
    )
    normalized_suggestions = (
        [
            item
            for item in suggestions
            if isinstance(item, dict)
            and isinstance(item.get("title"), str)
            and isinstance(item.get("description"), str)
            and item["title"].strip()
            and item["description"].strip()
        ]
        if isinstance(suggestions, list)
        else fallback["suggestions"]
    )

    return {
        "scores": {
            "knowledge": _clamp_score(scores.get("knowledge"), fallback["scores"]["knowledge"]),
            "communication": _clamp_score(scores.get("communication"), fallback["scores"]["communication"]),
            "confidence": _clamp_score(scores.get("confidence"), fallback["scores"]["confidence"]),
            "emotion": _clamp_score(scores.get("emotion"), fallback["scores"]["emotion"]),
            "overall": _clamp_score(scores.get("overall"), fallback["scores"]["overall"]),
        },
        "strengths": normalized_strengths[:4] or fallback["strengths"],
        "improvements": normalized_improvements[:4] or fallback["improvements"],
        "suggestions": normalized_suggestions[:3] or fallback["suggestions"],
    }

# ===============================
# CREATE INTERVIEW SESSION
# ===============================
@interview_bp.route("/create", methods=["POST"])
def create_interview():
    data = request.json
    
    user_id = data.get("user_id")
    role = data.get("role")
    difficulty = data.get("difficulty")
    interview_type = data.get("interview_type", "technical")

    if not user_id or not role or not difficulty:
        return jsonify({"error": "Missing required fields"}), 400

    print(f"Starting interview for User: {user_id}, Role: {role}")

    # 1️⃣ Create Interview Record
    try:
        interview_data = {
            "user_id": user_id,
            "role": role,
            "difficulty": difficulty,
            "interview_type": interview_type
        }

        response = supabase.table("interviews").insert(interview_data).execute()

        if not response.data:
            return jsonify({"error": "Failed to create interview"}), 500

        new_interview = response.data[0]
        interview_id = new_interview["id"]

    except Exception as e:
        print("Error creating interview:", e)
        return jsonify({"error": str(e)}), 500
    

    # 2️⃣ Generate Questions
    try:
        questions_list = generate_interview_questions(role, difficulty, interview_type)
        questions_list = _sanitize_questions(questions_list)
        print("Generated Questions:", questions_list)
    except Exception as e:
        return jsonify({"error": f"Question generation failed: {str(e)}"}), 500

    # 3️⃣ Save Questions
    try:
        questions_to_insert = [
            {
                "interview_id": interview_id,
                "question_text": q
            }
            for q in questions_list
        ]

        supabase.table("questions").insert(questions_to_insert).execute()

    except Exception as e:
        print("Error saving questions:", e)

    # 4️⃣ Return Response
    return jsonify({
        "message": "Interview started",
        "interview_id": interview_id,
        "questions": questions_list
    })


# ===============================
# FETCH QUESTIONS FOR INTERVIEW
# ===============================
@interview_bp.route("/questions/<interview_id>", methods=["GET"])
def get_questions(interview_id):
    try:
        response = supabase.table("questions") \
            .select("question_text") \
            .eq("interview_id", interview_id) \
            .order("id") \
            .execute()

        rows = response.data or []
        raw_questions = [
            row.get("question_text")
            for row in rows
            if isinstance(row, dict)
        ]
        sanitized_questions = _sanitize_questions(raw_questions)
        response_rows = [{"question_text": question} for question in sanitized_questions]

        return jsonify(response_rows), 200

    except Exception as e:
        print("Error fetching questions:", e)
        return jsonify({"error": str(e)}), 500


# ===============================
# FETCH INTERVIEW HISTORY FOR USER
# ===============================
@interview_bp.route("/history/<user_id>", methods=["GET"])
def get_interview_history(user_id):
    selected_columns = (
        "id, role, interview_type, created_at, overall_score, final_feedback"
    )

    try:
        try:
            response = supabase.table("interviews") \
                .select(selected_columns) \
                .eq("user_id", user_id) \
                .order("created_at", desc=True) \
                .execute()
        except Exception as order_error:
            print("Created_at ordering failed, falling back to id ordering:", order_error)
            response = supabase.table("interviews") \
                .select(selected_columns) \
                .eq("user_id", user_id) \
                .order("id", desc=True) \
                .execute()

        rows = response.data or []
        normalized_rows = []

        for row in rows:
            feedback = row.get("final_feedback")
            parsed_feedback = None

            if isinstance(feedback, dict):
                parsed_feedback = feedback
            elif isinstance(feedback, str):
                try:
                    parsed_feedback = json.loads(feedback)
                except Exception:
                    parsed_feedback = None

            scores = parsed_feedback.get("scores", {}) if isinstance(parsed_feedback, dict) else {}
            overall_score = row.get("overall_score")
            if overall_score is None and isinstance(scores, dict):
                overall_score = scores.get("overall")

            # Skip sessions that were never analyzed.
            if overall_score is None and not parsed_feedback:
                continue

            normalized_rows.append({
                "id": row.get("id"),
                "role": row.get("role"),
                "interview_type": row.get("interview_type"),
                "created_at": row.get("created_at"),
                "overall_score": overall_score,
                "knowledge_score": scores.get("knowledge"),
                "communication_score": scores.get("communication"),
                "confidence_score": scores.get("confidence"),
                "emotion_score": scores.get("emotion"),
                "strengths": parsed_feedback.get("strengths", []) if isinstance(parsed_feedback, dict) else [],
                "improvements": parsed_feedback.get("improvements", []) if isinstance(parsed_feedback, dict) else [],
            })

        return jsonify(normalized_rows), 200

    except Exception as e:
        print("Error fetching interview history:", e)
        return jsonify({"error": str(e)}), 500
    
    
# ===============================
# ANALYZE INTERVIEW ANSWERS
# ===============================
@interview_bp.route("/analyze", methods=["POST"])
def analyze_interview():
    try:
        data = request.json

        interview_id = data.get("interview_id")
        answers = data.get("answers", [])
        clean_answers = [
            str(answer).strip()
            for answer in answers
            if isinstance(answer, (str, int, float)) and str(answer).strip()
        ]

        if not clean_answers:
            return jsonify({"error": "No answers provided"}), 400

        # Prompt for AI evaluation
        prompt = f"""
You are an AI interview evaluator.

Analyze the candidate responses and return ONLY valid JSON.

Return format:

{{
  "scores": {{
    "knowledge": number,
    "communication": number,
    "confidence": number,
    "emotion": number,
    "overall": number
  }},
  "strengths": [4 short bullet points],
  "improvements": [4 short bullet points],
  "suggestions": [
    {{ "title": "", "description": "" }},
    {{ "title": "", "description": "" }},
    {{ "title": "", "description": "" }}
  ]
}}

Evaluate based on:
- technical clarity
- communication quality
- confidence & fluency
- emotional stability
- structure & relevance

Candidate Answers:
{chr(10).join(clean_answers)}
"""

        try:
            completion = groq_client.chat.completions.create(
                model=analysis_model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                response_format={"type": "json_object"},
            )
            result_text = completion.choices[0].message.content or ""
            result_json = _parse_analysis_json(result_text)
            result_json = _normalize_analysis_payload(result_json, clean_answers)
        except Exception as model_error:
            print("Groq analysis generation failed, using fallback:", model_error)
            result_json = _fallback_analysis(clean_answers)

        # ✅ Save results to database (compatible with current schema)
        if interview_id:
            supabase.table("interviews").update({
                "overall_score": result_json["scores"]["overall"],
                "final_feedback": json.dumps(result_json),
            }).eq("id", interview_id).execute()

        return jsonify(result_json)

    except Exception as e:
        print("Analysis error:", e)
        return jsonify({"error": "Analysis failed"}), 500
