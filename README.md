# SkillSwap — A Smart Skill Barter Platform

## Problem It Solves
Many people want to learn new skills but lack access to paid courses or mentors. Meanwhile, others have valuable knowledge they can share. There’s no structured, peer-to-peer platform to exchange skills fairly and effectively.

## Solution
SkillSwap is a web-based platform where users can barter their skills with others — e.g., "I’ll teach you Python if you teach me Graphic Design." The platform uses machine learning to smartly match users based on their offered and desired skills.

## Key Features
- **Skill Profile Creation**: Add what you can teach and want to learn.
- **ML-Based Smart Matching**: Intelligent recommendations using NLP (BERT/Cosine similarity).
- **Real-Time Chat & Scheduler**: Coordinate sessions through built-in messaging.
- **Skill Verification**: Upload projects/resumes for auto-skill extraction (NER).
- **Resource Suggestions**: Get relevant learning materials post-matching.
- **Gamification**: Earn badges/points for completed sessions.

## Tech Stack
- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Auth**: Clerk/Auth0
- **ML/NLP**: Python (FastAPI or Flask microservice) with BERT/spaCy
- **Real-time**: Socket.io for messaging
- **Deployment**: Render / Vercel / Replit

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (local or cloud instance)
- Docker (optional, for Judge0 setup)

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/SkillSwap.git
   cd SkillSwap/collab-code-editor/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `backend` directory with the following:
   ```env
   MONGO_URI=<your-mongodb-uri>
   JUDGE0_URL=http://localhost:2358/submissions
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open the app in your browser at `http://localhost:3000`.

### Judge0 Setup (Optional for Code Execution)
1. Pull the Judge0 Docker image:
   ```bash
   docker pull judge0/api
   ```

2. Run the Judge0 container:
   ```bash
   docker run -d -p 2358:2358 judge0/api
   ```

### Machine Learning Microservice Setup
1. Navigate to the `ml-service` directory:
   ```bash
   cd ../ml-service
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the ML microservice:
   ```bash
   uvicorn app:app --reload
   ```

### Deployment
The project is deployed at **[SkillSwap](https://systemnotfound.xyz)**.

## Contributing
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.
