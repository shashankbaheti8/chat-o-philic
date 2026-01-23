# Chat-o-Philic 💬
A full-featured, real-time chat application built with the **MERN stack** (MongoDB, Express, React, Node.js). It offers a seamless messaging experience with modern features like group chats, real-time typing indicators, and secure authentication.

## 🚀 Features

-   **User Authentication**: Secure Login and Registration system using JWT.
-   **Real-time Messaging**: Instant message delivery powered by **Socket.io**.
-   **Group Chats**: Create collaborative groups, manage members, and rename conversations.
-   **One-on-One Chat**: Private, secure direct messaging.
-   **Typing Indicators**: Live visual feedback when someone is typing.
-   **Read Receipts**: Stay updated with new messages.
-   **Profile Management**: Upload profile pictures (via Cloudinary) and manage user details.
-   **Interactive UI**: Beautiful, responsive interface built with **React**, **Material UI**, and **Tailwind CSS**.
-   **Fast Performance**: Optimized frontend build using **Vite**.

## 🛠️ Tech Stack

### Client (Frontend)
-   **Vite**: Next Generation Frontend Tooling
-   **React**: UI Library
-   **Tailwind CSS**: Utility-first CSS framework
-   **Material UI (@mui/material)**: Component Library
-   **Socket.io-client**: Real-time bidirectional event-based communication
-   **Axios**: Promise based HTTP client
-   **React Router**: Declarative routing
-   **React Toastify**: Elegant notifications

### Server (Backend)
-   **Node.js**: JavaScript runtime environment
-   **Express**: Fast, unopinionated web framework
-   **MongoDB & Mongoose**: NoSQL Database & Object Data Modeling
-   **Socket.io**: Real-time communication engine
-   **JWT (JSON Web Token)**: Secure Stateless Authentication
-   **Bcrypt.js**: Password hashing and security

## ⚙️ Installation & Setup

Follow these steps to get the project running locally.

### Prerequisites
-   [Node.js](https://nodejs.org/) (v14+ recommended)
-   [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/chat-o-philic.git
cd chat-o-philic
```

### 2. Backend Setup
Navigate to the `server` directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
```
> **Note**: Add email config variables if using features requiring email sending.

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the `client` directory and install dependencies:
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_CLOUD_NAME=your_cloudinary_cloud_name
VITE_PRESET_NAME=your_cloudinary_upload_preset
VITE_CLOUDINARY_URL=https://api.cloudinary.com/v1_1/your_cloud_name/image/upload
```

Start the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 📂 Project Structure

```text
chat-o-philic/
├── client/                 # Frontend (Vite + React)
│   ├── src/
│   │   ├── Components/     # Reusable UI components
│   │   ├── Context/        # React Context (State Management)
│   │   ├── Pages/          # Application Pages
│   │   └── ...
│   └── ...
├── server/                 # Backend (Node + Express)
│   ├── controllers/        # Route logic
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   └── ...
└── README.md               # Documentation
```

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.
