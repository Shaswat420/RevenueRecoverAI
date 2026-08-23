# 💰 RevenueRecoverAI

RevenueRecoverAI is an AI-powered payment recovery platform designed to help businesses identify failed payments, analyze recovery opportunities, and recommend the best recovery action for each customer.

The platform combines a React dashboard, Spring Boot backend, MySQL database, and Python-based AI service into a containerized full-stack application.

---

## 🚀 Features

- 📊 Payment recovery dashboard
- 🤖 AI-powered recovery recommendations
- 🎯 Recovery score and priority classification
- 📈 Customer payment history analysis
- 💳 Failed payment reason analysis
- 🔄 One-click payment recovery
- 🧠 AI confidence scoring
- 💬 Personalized recovery messages
- 📋 Customer lifetime value tracking
- 🐳 Dockerized application
- 🗄️ MySQL database
- 🔗 RESTful APIs
- ⚡ Modern React dashboard

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │     React Frontend  │
                    │      Port: 3000     │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │   Spring Boot API   │
                    │      Port: 8080     │
                    └───────┬───────┬─────┘
                            │       │
                            │       │ AI Requests
                            │       ▼
                            │  ┌──────────────┐
                            │  │ Python AI    │
                            │  │   Service    │
                            │  └──────────────┘
                            │
                            ▼
                    ┌─────────────────────┐
                    │       MySQL         │
                    │      Port: 3307     │
                    └─────────────────────┘
🛠️ Tech Stack
Frontend
React
Vite
JavaScript
CSS
Backend
Java
Spring Boot
Spring Data JPA
Maven
REST API
AI Service
Python
AI-based recovery recommendation logic
Database
MySQL
DevOps
Docker
Docker Compose
Git
GitHub
📂 Project Structure
RevenueRecoverAI/
│
├── ai-service/
│   ├── Dockerfile
│   ├── main.py
│   └── requirements.txt
│
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/
│           └── resources/
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
│
├── docker-compose.yml
├── .gitignore
└── README.md
⚙️ Requirements
Make sure you have the following installed:
Docker
Docker Compose
Git
The complete application can be run through Docker Compose without separately installing MySQL, Java, or Python.
▶️ Run the Application
Clone the repository:
git clone https://github.com/Shaswat420/RevenueRecoverAI.git
Enter the project directory:
cd RevenueRecoverAI
Start all services:
docker compose up --build
🌐 Application URLs
Frontend
http://localhost:3000
Backend API
http://localhost:8080
Payments API
http://localhost:8080/api/payments
🔌 API Endpoints
Get All Payments
GET /api/payments
Returns payment records with recovery information.
Get Recovery Recommendation
POST /api/payments/{id}/recommend
Generates a recovery recommendation for a payment.
Recover Payment
POST /api/payments/{id}/recover
Attempts to recover the selected payment and updates its recovery status.
🧠 Recovery Intelligence
RevenueRecoverAI analyzes payment and customer information such as:
Payment failure reason
Successful payment history
Failed payment history
Customer lifetime value
Days since last payment
Previous payment behavior
Based on these factors, the platform provides:
Recovery Score
Priority
Recovery Probability
AI Confidence
Recommended Action
Recommendation Reason
Personalized Recovery Message
📊 Example Recovery Analysis
Customer	Amount	Failure Reason	Recovery Score	Priority
Rahul Sharma	₹5,000	Insufficient Funds	100	HIGH
Priya Singh	₹2,500	Card Expired	50	MEDIUM
Amit Kumar	₹8,500	Gateway Error	100	HIGH
Neha Verma	₹3,200	Insufficient Funds	50	MEDIUM
🐳 Docker Services
The application consists of three main services:
Frontend
revenue-recover-frontend
Runs the React application.
Backend
revenue-recover-backend
Runs the Spring Boot REST API.
Database
revenue-recover-mysql
Runs MySQL for persistent payment data.
🛑 Stop the Application
docker compose down
🔄 Rebuild the Application
If you make changes to the source code:
docker compose down
docker compose up --build
🔐 Environment & Security
For production deployment, sensitive credentials such as database passwords should be stored using environment variables or a secrets manager rather than directly in configuration files.
🎯 Future Improvements
Real payment gateway integration
Stripe/Razorpay integration
Email and SMS recovery campaigns
Automated retry scheduling
Advanced ML-based recovery prediction
Authentication and role-based access control
Analytics and reporting
Payment recovery history
Production cloud deployment
CI/CD pipeline
Kubernetes deployment
👨‍💻 Author
Shashwat Pandey
GitHub: https://github.com/Shaswat420