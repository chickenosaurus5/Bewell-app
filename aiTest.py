from google import genai

client = genai.Client(api_key="AIzaSyCI0io8ss6yixRmnN5X004luaJhG5z4eB0")

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Explain how AI works in a few words",
)

print(response.text)