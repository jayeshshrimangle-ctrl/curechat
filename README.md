# 🏥 Vectorax Health Care — AI Healthcare Chatbot

A modern, full-stack AI-powered healthcare chatbot web application built with **Node.js**, **Express**, **MongoDB**, and **Google Gemini AI**.

![Vectorax Health Care](https://img.shields.io/badge/Vectorax-Health%20Care-0ea5e9?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)

---

## ✨ Features

- **🤖 AI Health Chatbot** — Powered by Google Gemini AI for intelligent health conversations
- **🔍 Symptom Checker** — Describe symptoms and get AI-powered analysis
- **💊 Medicine Reminders** — Set up personalized medicine schedules
- **💡 Health Tips** — Get advice on nutrition, exercise, mental wellness
- **🩺 Doctor Finder** — Browse doctors by specialization and location
- **📅 Appointments** — Book online or in-person consultations
- **💬 Chat History** — All conversations saved per user in MongoDB
- **👤 User System** — Secure login/register with JWT authentication
- **📱 Responsive Design** — Works on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | HTML, CSS, JavaScript               |
| Styling    | Custom CSS (Dark Healthcare Theme)  |
| Backend    | Node.js + Express.js                |
| Database   | MongoDB (Mongoose ODM)              |
| AI Model   | Google Gemini 2.0 Flash             |
| Auth       | JWT (JSON Web Tokens) + bcrypt      |

---

## 📁 Project Structure

```
vectorax-healthcare-ai/
│
├── frontend/
│   ├── index.html          # Home page
│   ├── chat.html           # AI Chatbot page
│   ├── doctor.html         # Find Doctors page
│   ├── appointment.html    # Book Appointments page
│   ├── login.html          # Login page
│   ├── register.html       # Registration page
│   ├── dashboard.html      # User Dashboard
│   ├── css/
│   │   └── style.css       # Global styles
│   └── js/
│       └── auth.js         # Authentication utilities
│
├── backend/
│   ├── server.js           # Express server entry point
│   ├── models/
│   │   ├── User.js         # User schema
│   │   ├── ChatHistory.js  # Chat history schema
│   │   ├── Doctor.js       # Doctor schema
│   │   └── Appointment.js  # Appointment schema
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   ├── doctorController.js
│   │   └── appointmentController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── doctorRoutes.js
│   │   └── appointmentRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   └── seed/
│       └── seedDoctors.js  # Sample doctors data
│
├── .env                    # Environment variables
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Setup & Installation

### Prerequisites

- **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
- **MongoDB** — [Install locally](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Google Gemini API Key** — [Get your key](https://aistudio.google.com/apikey)

### Step 1: Install Dependencies

```bash
cd "chat bot"
npm install
```

### Step 2: Configure Environment Variables

Edit the `.env` file in the project root:

```env
# MongoDB Connection
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/vectorax_healthcare

# OR MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/vectorax_healthcare

# Google Gemini API Key (REQUIRED)
GEMINI_API_KEY=your_gemini_api_key_here

# JWT Secret (change this for production)
JWT_SECRET=your_secret_key_here

# Server Port
PORT=3000
```

### Step 3: Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key and paste it in `.env` as `GEMINI_API_KEY`

### Step 4: Start MongoDB

**If using local MongoDB:**
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

**If using MongoDB Atlas**, just make sure your connection string in `.env` is correct.

### Step 5: Start the Server

```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

### Step 6: Open in Browser

Navigate to: **http://localhost:3000**

---

## 📖 Pages & Routes

| Page           | URL             | Description                    |
|----------------|-----------------|--------------------------------|
| Home           | `/`             | Landing page with features     |
| AI Chatbot     | `/chat`         | Chat with AI Health Assistant  |
| Find Doctors   | `/doctors`      | Browse/search doctors          |
| Appointments   | `/appointment`  | Book & manage appointments     |
| Login          | `/login`        | User login                     |
| Register       | `/register`     | User registration              |
| Dashboard      | `/dashboard`    | User profile & stats           |

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint           | Description       |
|--------|--------------------|--------------------|
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | Login user        |
| GET    | `/api/auth/me`       | Get current user  |
| PUT    | `/api/auth/profile`  | Update profile    |

### Chat
| Method | Endpoint           | Description          |
|--------|---------------------|----------------------|
| POST   | `/api/chat/send`    | Send message to AI   |
| GET    | `/api/chat/history` | Get chat list        |
| GET    | `/api/chat/:id`     | Get chat messages    |
| DELETE | `/api/chat/:id`     | Delete chat          |

### Doctors
| Method | Endpoint                    | Description             |
|--------|------------------------------|-------------------------|
| GET    | `/api/doctors`              | Get all doctors         |
| GET    | `/api/doctors/specializations` | Get specializations  |
| GET    | `/api/doctors/:id`          | Get doctor details      |

### Appointments
| Method | Endpoint                      | Description           |
|--------|--------------------------------|-----------------------|
| POST   | `/api/appointments`           | Book appointment      |
| GET    | `/api/appointments`           | Get user appointments |
| PUT    | `/api/appointments/:id/cancel` | Cancel appointment   |

---

## 🗄️ Database Collections

- **Users** — User accounts with hashed passwords
- **ChatHistories** — Conversation history per user
- **Doctors** — Doctor profiles and availability
- **Appointments** — Booking records

---

## 📝 License

MIT License — © 2024 Vectorax Health Care

---

**Made with ❤️ by Vectorax Health Care**
