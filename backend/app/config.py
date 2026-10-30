import google.generativeai as genai

GEMINI_API_KEY = "YOUR_API_KEY_HERE"

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")