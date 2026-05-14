import os
import json
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from pydantic import BaseModel
from typing import List, Optional
import tempfile
import database
from fastapi import HTTPException


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
# Using gemini-1.5-flash as it is fast and supports multimodal (audio, images, text)
model = genai.GenerativeModel('gemini-2.5-flash') 

SYSTEM_PROMPT = """
You are an expert technical product manager. Analyze the following messy client inputs (which may include text, voice transcripts, and screenshots). 
Output a clean, structured JSON project brief with the following keys:
- "summary": A plain-language summary of what the client actually wants.
- "goals": An array of goals and success criteria pulled from the input.
- "missing": An array of things that are unclear or missing that need clarifying before work starts.
- "follow_ups": An array of suggested follow-up questions to send back to the client.
Ensure the output is strictly valid JSON.
"""

@app.post("/api/generate")
async def generate_brief(
    text_input: Optional[str] = Form(None),
    files: List[UploadFile] = File(None)
):
    prompt_parts = [SYSTEM_PROMPT]
    
    if text_input:
        prompt_parts.append(f"Client Text Input: {text_input}")
        
    uploaded_gemini_files = []
    
    # Process files if any
    if files:
        for file in files:
            if file.filename:
                # Save temp file to upload to Gemini
                with tempfile.NamedTemporaryFile(delete=False, suffix=f"_{file.filename}") as temp_file:
                    content = await file.read()
                    temp_file.write(content)
                    temp_file_path = temp_file.name
                
                try:
                    gemini_file = genai.upload_file(temp_file_path)
                    uploaded_gemini_files.append(gemini_file)
                    prompt_parts.append(gemini_file)
                finally:
                    os.remove(temp_file_path)

    if len(prompt_parts) == 1: # Only system prompt exists
        raise HTTPException(status_code=400, detail="No input provided")

    try:
        response = model.generate_content(prompt_parts)
        # Clean up Markdown JSON formatting if present
        result_text = response.text.replace("```json", "").replace("```", "").strip()
        
        # Save to DB
        brief_id = database.save_brief(result_text)
        
        return {"status": "success", "brief_id": brief_id, "data": json.loads(result_text)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/brief/{brief_id}")
async def get_brief(brief_id: str):
    try:
        brief_data = database.get_brief(brief_id)
        if not brief_data:
            raise HTTPException(status_code=404, detail="Brief not found")
        return {"status": "success", "content": brief_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/api/brief/{brief_id}/confirm")
async def confirm_brief(brief_id: str):
    try:
        database.confirm_brief_in_db(brief_id)
        return {"status": "success", "message": "Brief confirmed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to confirm brief: {str(e)}")

# Mount static files for the frontend
app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
