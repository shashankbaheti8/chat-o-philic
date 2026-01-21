# 💬 Chat-o-Philic - Real-time Chat Application

A **full-stack real-time chat application** built with **React (Material UI)** and **Node.js + Express + MongoDB**. Supports **1-on-1 and group chats**, real-time messaging via **Socket.IO**, and user authentication.

🔗 **Live Demo**:
[https://chat-o-philic.vercel.app](https://chat-o-philic.vercel.app)

---

## 🗂️ Table of Contents

* [✨ Features](#-features)
* [🛠 Tech Stack](#-tech-stack)
* [🚀 Setup Instructions](#-setup-instructions)
  * [1. Clone Repository](#1-clone-repository)
  * [2. Backend Setup](#2-backend-setup)
  * [3. Frontend Setup](#3-frontend-setup)
* [📦 Folder Structure](#-folder-structure)
* [⚙️ Deployment](#️-deployment)

---

## ✨ Features

* 🔐 JWT-based Authentication
* 👥 1-on-1 and Group Chat Support
* 🔴 Real-time messaging with **Socket.IO**
* 👤 Profile Viewing & Management
* 📱 Responsive and Modern UI (Material UI)
* ☁️ Persistent chat history via MongoDB

---

## 🛠 Tech Stack

| Frontend       | Backend            | Real-Time | Styling      |
| -------------- | ------------------ | --------- | ------------ |
| React.js       | Node.js            | Socket.IO | Material UI  |
| Axios          | Express.js         |           | Poppins Font |
| React Router   | MongoDB + Mongoose |           |              |
| React Toastify | JWT Authentication |           |              |

---

## 🚀 Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/shashankbaheti8/chat-o-philic.git
cd chat-o-philic
```

---

### 2. Backend Setup

```bash
cd backend
# Fill in your MONGO_URI, JWT_SECRET, FRONTED_URL, and PORT

npm install
npm run dev
```

#### `.env` Format:

```env
PORT=
MONGO_URI=
JWT_SECRET=
FRONTED_URL=
```

---

### 3. Frontend Setup

```bash
cd ../frontend
# Set the API base URL for local dev

npm install
npm run dev
```

#### `.env` Format:

```env
REACT_APP_BACKEND_URL=
REACT_APP_CLOUD_NAME=
REACT_APP_PRESET_NAME=
REACT_APP_CLOUDINARY_URL=
```

Open [http://localhost:5173](http://localhost:5173) to use the app locally.

---

## 📦 Folder Structure

### 📁 Frontend (`/frontend`)

```
src/
├── components/
│   ├── Authentication/
│   ├── Chatbox.jsx
│   ├── MyChats.jsx
│   └── ...
├── Context/
│   └── ChatProvider.jsx
├── Pages/
│   ├── HomePage.jsx
│   └── ChatPage.jsx
├── socket.js
├── App.jsx
└── main.jsx
```

### 📁 Backend (`/backend`)

```
backend/
├── controllers/
├── models/
├── routes/
├── middlewares/
└── server.js
```

---

## ⚙️ Deployment

### ✅ Frontend

Deployed on **Vercel**


### ✅ Backend

Deployed on **Render**

---
