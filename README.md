# 🩺 MediMitra — Multimodal AI Healthcare & Prescription Interpreter

**MediMitra** is a full-stack, AI-powered medical assistant designed to interpret handwritten doctor prescriptions and lab reports, detect critical drug-drug interactions, and translate clinical instructions into regional Indian languages (Hindi, Marathi, Malayalam, etc.) while keeping pharmacological terms standard.

---

## 🌟 Key Features

* **Multimodal Document Processing:** Parses prescription images and multi-page PDFs using Google Gemini Vision AI.
* **Multilingual Clinical Translation:** Translates dosage instructions and purpose into regional languages while preserving English drug names for pharmacy safety.
* **Automated Safety Engine:** Evaluates cross-drug interactions and generates severity-based warning alerts for dangerous drug pairs (e.g., Aspirin + Warfarin).
* **SHA-256 Binary Caching:** Computes binary cryptographic hashes of uploaded files to deliver instant 0ms cached responses from SQLite, reducing redundant LLM API calls and latency.
* **Deterministic Anti-Hallucination Guardrails:** Utilizes temperature=0.0 configuration and rigid system prompt rules to guarantee exact medication counts and zero hallucinated prescriptions.

---

## 🏗️ Architecture & Tech Stack

Frontend (React.js + Tailwind CSS) ---> FastAPI Backend ---> SQLite Cache (SHA-256 Check) & Gemini 1.5 Flash API

* **Frontend:** React.js, Tailwind CSS, Vite, Lucide Icons
* **Backend:** FastAPI (Python), Uvicorn (ASGI Server), Pydantic
* **Database & ORM:** SQLite, SQLAlchemy
* **AI & Vision:** Google GenAI SDK (google-genai), Gemini 1.5 Flash

---

## 🚀 Getting Started

### Prerequisites
* Python 3.10+
* Node.js 18+
* Google Gemini API Key

---

### 1. Backend Setup

# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables (.env file)
# GEMINI_API_KEY=your_gemini_api_key_here

# Run FastAPI server
uvicorn main:app --reload --port 8000

---

### 2. Frontend Setup

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

Open http://localhost:5173 in your browser to view the application.

---

## 🎯 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | /api/upload | Uploads document/image, processes via Gemini or returns cached SQLite response |
| GET | /api/history | Fetches complete history of cached prescription reports |
| GET | /health | Server health check endpoint |

---

## 🔒 Security & Limitations

* **Informational Guidance Only:** MediMitra includes a mandatory disclaimer emphasizing that it serves as an assistive companion tool and is not a replacement for professional medical diagnosis or consultation.
* **Deterministic Extraction:** Configured with temperature=0.0 to maximize OCR extraction fidelity on handwritten records.

---

## 📄 License

Distributed under the MIT License.

## Preview : https://medimitra-ashen.vercel.app/
