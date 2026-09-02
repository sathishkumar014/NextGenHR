import os
import json
import re
from groq import Groq

# Initialize Groq Client
# Ensure GROQ_API_KEY is in your .env file
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

INTRO_QUESTION = "Tell me about yourself and your background."
TOTAL_QUESTIONS = 5
FOLLOW_UP_COUNT = TOTAL_QUESTIONS - 1
INTRO_QUESTION_KEY = re.sub(r"[^a-z0-9]+", "", INTRO_QUESTION.lower())


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


def _dedupe_preserve_order(items):
    seen = set()
    output = []
    for item in items:
        key = _question_key(item)
        if not key:
            continue
        if key in seen:
            continue
        seen.add(key)
        output.append(item)
    return output


def _normalize_follow_up_questions(raw_questions, role, interview_type):
    cleaned = []
    if isinstance(raw_questions, list):
        for question in raw_questions:
            if not isinstance(question, str):
                continue
            normalized = question.strip()
            if not normalized:
                continue
            if _is_intro_question(normalized):
                continue
            cleaned.append(normalized)

    cleaned = _dedupe_preserve_order(cleaned)

    fallback_followups = [
        f"Why are you interested in this {role} role?",
        f"What key skills are most important for a {interview_type} interview in {role}?",
        "Describe a challenging project you worked on and your specific contribution.",
        "How do you approach learning new tools or technologies in your field?",
        "What would your first 90 days in this role look like?",
    ]

    for fallback in fallback_followups:
        if len(cleaned) >= FOLLOW_UP_COUNT:
            break
        if _question_key(fallback) not in {_question_key(q) for q in cleaned}:
            cleaned.append(fallback)

    return cleaned[:FOLLOW_UP_COUNT]


def generate_interview_questions(role, difficulty, interview_type):
    """
    Returns interview questions with a fixed first prompt and Groq-generated follow-ups.
    """

    prompt = f"""
    You are an expert interviewer.
    Generate exactly {FOLLOW_UP_COUNT} unique {difficulty} level interview questions
    for a {role} role in a {interview_type} interview.

    Do NOT include an introduction question like "Tell me about yourself".

    Return the response STRICTLY as a JSON array of strings. 
    Example format: ["Question 1...", "Question 2...", "Question 3...", "Question 4..."]
    Do not add any markdown formatting like ```json. Just the raw array.
    """

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that outputs JSON."
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.1-8b-instant",
            temperature=0.7,
        )

        # Parse the JSON string from the response
        content = chat_completion.choices[0].message.content
        
        # Clean up any potential markdown code blocks
        content = content.replace("```json", "").replace("```", "").strip()

        questions = json.loads(content)
        follow_up_questions = _normalize_follow_up_questions(questions, role, interview_type)
        return [INTRO_QUESTION, *follow_up_questions]

    except Exception as e:
        print(f"Error generating questions: {e}")
        # Fallback questions in case AI fails
        return [
            INTRO_QUESTION,
            f"Why are you interested in this {role} position?",
            f"What do you expect in a {interview_type} interview for this role?",
            "Describe a challenging technical problem you solved.",
            "How do you prioritize tasks when handling multiple deadlines?",
        ]
