# SkillSwap 🔄🧠

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**SkillSwap** is an advanced, peer-to-peer knowledge exchange and real-time collaboration platform. It empowers users to teach and learn from each other through algorithmic matching, live video communication, and a fully synchronized collaborative coding environment. To ensure trust, the platform features automated skill validation via GitHub repository analysis and OCR-based certificate verification.

---

## 🚀 Platform Ecosystem & Microservices Architecture

SkillSwap is built using a highly scalable, decoupled microservices architecture to handle distinct, resource-intensive tasks efficiently:

1. **Main Client (`/client`):** The central React.js frontend application featuring user onboarding, match filtering, and the collaboration dashboard.
2. **Core API Server (`/server`):** The central Node.js/Express backend managing users, exchange requests, database interactions, and media uploads.
3. **Collaboration Engine (`/collab-code-editor/backend`):** A high-performance **Python/FastAPI** service managing low-latency WebSocket connections for real-time keystroke synchronization and code execution.
4. **Certificate Verification Service (`/certCheck`):** An independent Express service utilizing `tesseract.js` (OCR) and `pdf-parse` to automatically extract and validate user-uploaded certificates.
5. **GitHub Analyzer Service (`/repoVerify`):** A dedicated service that interfaces with the GitHub API to analyze user repositories and validate coding proficiency.
6. **Code Execution Sandbox (`/collab-code-editor/judge0`):** A Dockerized **Judge0** instance providing isolated, secure, multi-language code compilation and execution.

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework:** React.js (Vite)
* **Routing:** React Router DOM
* **Editor:** Monaco Editor (`@monaco-editor/react`)
* **Real-time:** Socket.io-client, WebRTC (for Video Calls)
* **Styling:** Tailwind CSS

### **Backend & Microservices**
* **Core API:** Node.js, Express.js
* **Collab API:** Python, FastAPI, python-socketio
* **Database:** MongoDB (Mongoose ODM)
* **Authentication:** Clerk (`@clerk/clerk-sdk-node`)
* **Media Management:** Cloudinary API, Multer
* **AI/Parsing:** Tesseract.js (Optical Character Recognition), PDF-Parse

### **Infrastructure & Execution**
* **Code Compiler:** Judge0 (Dockerized)
* **Containerization:** Docker & Docker Compose

---

## 🌟 Core Features

### 🤝 **Intelligent Matchmaking & Swapping**
* **Algorithmic Matching:** Users are paired based on their "Offered Skills" vs. "Desired Skills" (`MatchFilters`, `MatchesList`).
* **Exchange Lifecycle:** End-to-end management of skill exchange requests (Pending, Accepted, Completed).

### 💻 **Real-Time Collaboration Workspace**
* **Live Video Calling:** Integrated WebRTC/Socket-based video communication (`VideoCall.jsx`) for seamless face-to-face mentoring.
* **Synchronized Code Editor:** Google Docs-style real-time typing using Monaco Editor and FastAPI WebSockets (`EditorRoom.jsx`).
* **Live Code Execution:** Write, compile, and run code in multiple languages directly in the browser via the Judge0 execution engine (`OutputConsole.jsx`).

### 🛡️ **Automated Trust & Verification**
* **GitHub Repository Analysis:** Automatically evaluates a user's GitHub activity, languages used, and repository quality to verify their claimed tech skills.
* **Smart Certificate OCR:** Users upload PDFs or images of course certificates, which the platform parses using Optical Character Recognition to extract names, dates, and granting institutions.

---

## 🔒 Security & Production Feasibility

SkillSwap is designed with **Enterprise-Grade** security patterns and is highly feasible for scalable production deployment:

* **Robust Identity Management:** Leverages **Clerk** for secure, token-based authentication and session management. API routes are protected by custom `clerkAuth` middleware.
* **Isolated Code Execution:** User-submitted code is never executed directly on the host server. It is routed to the **Judge0** Docker container, providing strict sandboxing, memory limits, and timeout constraints to prevent malicious payloads or infinite loops.
* **Independent Scalability:** By utilizing a microservices architecture, CPU-heavy tasks (like OCR parsing or FastAPI WebSocket handling) can be scaled horizontally on AWS/GCP independently of the main Express CRUD API.
* **Secure Asset Delivery:** Profile pictures and documents are securely processed via `multer` and uploaded to **Cloudinary**, ensuring fast CDN delivery and offloading storage bandwidth from the main server.

---

## 💻 Getting Started

Due to the microservices architecture, running the full suite requires starting multiple services.

### Prerequisites
* Node.js (v18+)
* Python (3.10+)
* Docker & Docker Compose
* MongoDB instance (Local or Atlas)
* Clerk API Keys & Cloudinary API Keys

### Running the Environment locally

**1. Start the MongoDB & Backend Server:**
```bash
cd server
npm install
npm run dev
**2. Start the Frontend Client:**

```bash
cd client
npm install
npm run dev
```

**3. Start the Verification Microservices:**

```bash
# In separate terminal windows:
cd certCheck && npm install && node app.js
cd repoVerify && npm install && node app.js
```

**4. Start the Collaboration & Execution Engine:**

```bash
# Start Judge0 via Docker
cd collab-code-editor/judge0/judge0-v1.13.0/judge0-v1.13.0
docker-compose up -d

# Start the FastAPI WebSocket Server
cd ../../../backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
