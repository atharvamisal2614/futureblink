# Flow Application

A full-stack web application that visualizes AI-powered prompt-response flows using React Flow. Users can input prompts, get AI-generated responses via OpenRouter API, and save interactions to MongoDB.

## Tech Stack

- **Frontend**: React + Vite + React Flow
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **AI**: OpenRouter API (Google Gemini 2.0 Flash Lite)

## Prerequisites

Before running this application, ensure you have:

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- OpenRouter API Key

## 🛠️ Setup Instructions

### 1. Clone and Navigate

```bash
cd d:\atharva\futureblink-assessment
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit the .env file with your actual credentials:
# - OPENROUTER_API_KEY: Your OpenRouter API key
# - MONGODB_URI: Your MongoDB connection string
```

**Important**: Update the `backend/.env` file with your actual credentials:
env
PORT=5000
MONGODB_URI=MONGODB_URL here
OPENROUTER_API_KEY=your_actual_openrouter_api_key_here


### 3. Frontend Setup

cd frontend

npm install

## unning the Application

You'll need **two terminal windows**:

### Terminal 1 - Backend Server

cd backend
npm start


The backend server will start on `http://localhost:5000`

### Terminal 2 - Frontend Dev Server

cd frontend
npm run dev


The frontend will start on `http://localhost:5173`

## 🎯 How to Use

1. **Open the Application**: Navigate to `http://localhost:5173` in your browser

2. **Enter a Prompt**: Click on the "Input Prompt" node and type your question
   - Example: "What is the capital of France?"

3. **Run the Flow**: Click the "Run Flow" button
   - The app sends your prompt to the OpenRouter API
   - The AI response appears in the "AI Response" node

4. **Save the Interaction**: Click the "Save" button
   - This saves the prompt and response to MongoDB




