from google import genai
from config import GEMINI_API_KEY,GEMINI_MODEL


client=genai.Client(api_key=GEMINI_API_KEY)

def generate_text(prompt:str)->str:
    """
    Send a prompt to Gemini and return its text.
    """
    
    response=client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
    )
    
    if not response.text:
        raise RuntimeError("Gemini returned an empty response.")
    
    return response.text

