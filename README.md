# NORPLE: AI-Powered Project Brief Generator

NORPLE is a web application designed to help freelancers and development teams instantly transform disorganized, unstructured client communication into professional, highly polished project briefs. By leveraging the native multimodal capabilities of advanced AI, it parses messy combinations of text notes, design screenshots, and raw audio files directly into a single unified workspace.

## Core Product Features
* Multimodal Data Intake: Directly ingests user-uploaded raw text prompts, reference screenshots, or voice memos without requiring manual translation, transcription, or separate optical character recognition layers.
* Dedicated Deep-Link Architecture: Generates a secure, standalone shareable URL for each workspace configuration (/brief.html?id=YOUR_UUID), bypassing onboarding fields entirely for quick client access.
* Color-Coded Analysis Cards: Restructures analytical outputs into dedicated, scannable summary cards featuring a soft green theme for project goals, a warning red theme for missing parameters, and a signature blue theme for follow-up questions.
* Client Confirmation Onboarding: Incorporates an automated validation trigger loop ("I confirm this brief") allowing clients to instantly flag approval states straight to your active database.
* Clean Softworks Visual Grid: Implements a sleek, modern off-white (#EBEBEB) UI theme accented by bold typographic headers, signature vector icons, and geometric pill-shaped interface boxes.

## Technology Stack
* Frontend: HTML5 / Modern CSS / Vanilla JS (Implements a clean presentation layout and handles asynchronous user upload events)
* Backend: Python / FastAPI (Runs robust, asynchronous API endpoints and serves all client-facing dashboard materials)
* AI Engine: Google Generative AI SDK (gemini-3.1-flash) (Powers structural file analysis using high-performance JSON formatting profiles)
* Database: Supabase Engine (Tracks real-time analytical records using scalable JSONB row distributions)
* Deployment: Railway Platform (Optimizes continuous building workflows straight from integrated Git repositories)

## Repository Architecture
 main.py                # Core FastAPI web server mounting routes & Gemini endpoints 
 database.py            # Supabase connection orchestration layer
 requirements.txt       # Python environment dependency manifest
 .gitignore             # Active safety filters to block local token exposures
 .env.example           # Sample configuration blueprint for active workspace tokens
 static/                # Main assets container mounted directly to backend roots
   index.html         # Intake form interface and main landing layout
   brief.html         # Dedicated visualization template for structured brief readouts
   app.js             # Input event handlers, upload feedback trackers, and redirection workflows  
   brief.js           # Direct client-side database querying via specific item IDs
   style.css          # Polished minimalist gray/black design definitions

## Database Configuration
Before launching the utility, create a new backend data container table within your Supabase Dashboard labeled `briefs` using the following schema specifications:

* `id`: Configured as type `uuid`, assigned as the Primary Key, with its default system fallback initialized precisely to `gen_random_uuid()` to run automated primary values.
* `content`: Configured as type `jsonb` to seamlessly hold varying data distributions natively parsed from your AI outputs.
* `confirmed`: Configured as type `boolean` with its operational default initialized to `false` to handle client sign-off records.
