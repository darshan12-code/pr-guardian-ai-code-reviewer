from services.gemini_service import generate_text
 
response = generate_text(
    "You are a code review assistant."
    "Reply with exactly: PR Guardian Gemini connected."
)
print(response)