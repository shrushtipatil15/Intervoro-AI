# Intervoro AI

An AI-powered interview preparation platform designed specifically for programmers and developers. The system conducts technical mock interviews, evaluates candidate answers using a Large Language Model (LLM), and provides scores, personalized feedback, and performance analysis.

## Problem Statement

Many students and developers do not get enough opportunities to practice technical interviews with experienced interviewers. Existing interview-practice platforms may provide questions but often lack detailed, personalized evaluation of every answer.

This project aims to provide an automated technical interview practice system that evaluates candidate answers using an LLM and provides meaningful feedback.

## Objectives

- Conduct AI-based technical mock interviews.
- Generate or provide relevant programming and technical interview questions.
- Evaluate candidate answers using an LLM.
- Provide scores for interview performance.
- Generate personalized feedback.
- Help programmers and developers identify their strengths and weaknesses.
- Analyze overall interview performance.

## Target Users

- Computer Science students
- Programmers
- Software Developers
- Technical job candidates
- Freshers preparing for technical interviews

## Key Features

- User Registration and Login
- Developer-focused Technical Interviews
- Interview Setup
- Technical Question and Answer System
- AI-based Answer Evaluation
- Automated Scoring
- Personalized Feedback
- Performance Analysis
- Interview Results
- Result Storage

## System Flow

Register
↓
Login
↓
Select Developer Interview
↓
Interview Setup
↓
Start Interview
↓
Answer Technical Questions
↓
LLM-based Evaluation
↓
Score Generation
↓
Personalized Feedback
↓
Final Performance Report
↓
Store Results in Database

## Technology Stack

### Frontend
- React.js
- Vite
- JavaScript
- HTML
- CSS
- Axios
- React Router

### Backend
- Python
- FastAPI
- Uvicorn
- REST APIs

### Database
- MongoDB

### AI / LLM
- Google Gemini
- Gemini 2.5 Flash

### Authentication
- JWT Authentication

## AI Evaluation

The candidate's interview answer is processed by the Large Language Model. The model analyzes the answer and generates an evaluation based on factors such as relevance, quality, and correctness.

The system then provides:

- Score
- Strengths
- Areas for improvement
- Personalized feedback
- Overall performance analysis

## Research Focus

The research focuses on automated interview answer evaluation and personalized feedback using Large Language Models.

### Research Question

Can a Large Language Model be used to automatically evaluate technical interview answers and provide personalized feedback to programmers and developers?

### Hypothesis

An LLM can effectively evaluate technical interview answers and provide useful scores and personalized feedback that can help candidates improve their interview performance.

## Future Scope

- Voice-based interviews
- Coding question evaluation
- Programming code analysis
- More technical domains
- Advanced performance analytics
- Interview history and progress tracking
- Support for multiple interview types

## Project Structure

```text
AI-Interview-Bot/
│
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
 #INSTALLATION

 
backend

py -m venv venv

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

.\venv\Scripts\Activate.ps1


python -m pip install --upgrade pip

pip install -r requirements.txt

python -m pip install fastapi uvicorn
python -m pip install email-validator
pip install google-generativeai
pip install pymongo
pip install python-dotenv
pip install pyjwt
pip install passlib
pip install python-jose
pip install python-multipart
pip install bcrypt

python -m uvicorn app.main:app --reload

---------------------
Frontend 


npm install

npm run dev
