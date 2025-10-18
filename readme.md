# 🎬 VidTube

## 🧠 Tech Stack

**Frontend:** React + Vite + Tailwind CSS  
**Backend:** Node.js + Express  
**Database:** MongoDB (Mongoose ODM)  
**Media Storage:** Cloudinary  
**Authentication:** JWT (Access + Refresh Tokens via HTTP-only cookies)  
**API Design:** RESTful architecture  

---

## 📖 Project Overview

**VidTube** is a full-stack video streaming and sharing platform inspired by YouTube.  
It was created as a **learning project** to explore backend development, API design, and frontend integration using modern technologies.

> ⚙️ The backend architecture and authentication flow were **inspired by and learned from Hitesh Choudhary’s Udemy course**, while the frontend was independently designed and implemented for practice.

### 🎯 Core Capabilities
- Secure JWT authentication (access + refresh token system)  
- Video upload and playback  
- Like, dislike, and comment system  
- Profile management with your videos, liked videos, history, and playlist tabs  
- Subscriptions and channel following  
- Search and homepage-based navigation  

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Threcia-01/VidTube.git
cd VidTube

2️⃣ Install Dependencies

Install the dependencies for both backend and frontend manually after looking into the pakage.json file — this is mandatory for proper setup.

# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install

3️⃣ 🔐 Environment Variables Setup
You need to create two .env files, one for the backend and one for the frontend.

🖥️ Backend (backend/.env)
PORT=8000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development

🌐 Frontend (frontend/.env)
VITE_API_BASE=http://localhost:8000/api/v1

4️⃣ Run the Project
Use two terminals simultaneously — one for the backend and one for the frontend.

# Terminal 1 – Start backend
cd backend
npm run dev

# Terminal 2 – Start frontend
cd frontend
npm run dev

✅ Both servers should start successfully and connect automatically using the existing configuration.

------------------------------------------------------------------------🚀 Key Features & Testing Guide------------------------------------------------------------------------

# 🔑 Authentication (JWT)
--Secure registration and login
--Tokens stored via HTTP-only cookies
--Auto-refresh flow for persistent sessions

#To test:
--Register a user
--Log in
--Access the dashboard — tokens auto-refresh

# 👤 Profile Page
--View or edit profile details
--Upload or update avatar
--Manage uploaded videos
--Access liked, playlist, and history tabs
--Manage subscriptions dynamically

# 🎥 Video Player Page
--Video playback with like/dislike
--Subscribe / Unsubscribe
--Comment, like, edit, or delete comments
--View count tracking even when accessed directly via URL
--Video recommendations

#To test:
--Open any video → Interact → Refresh → Data persists.

# 🧭Navigation & 🔍 Search
--Sidebar navigation (Home, Trending, Subscriptions, etc.)
--Search bar dynamically fetches relevant results via backend API

# 📤 Upload a Video
--After successful login, users can upload any video of their choice to VidTube.

#To test:
Click on Upload, enter title and description, select a video (and optionally a thumbnail), then upload.

# 🚫 Not Found Page
If a user visits a non-existent route, a custom page appears with a redirect link to the homepage.

#💡 Future Enhancements
--Playlist creation & management
--Notification system
--Mobile responsiveness improvements
--Creator analytics dashboard
--UI/UX refinements

# 💬 Acknowledgment
This project’s backend architecture and authentication model were learned from Hitesh Choudhary’s Udemy Node.js course, which was later modified and extended by me.
The frontend and integration logic were developed independently as part of a hands-on learning experience.

#🌟 Support the Project
If this project helped you learn something new, consider the following:

--⭐ Star the repository
--🛠️ Fork and improve it
--💬 Share feedback or ideas

###########################################VidTube — a practical full-stack project built to explore, learn, and implement modern web development concepts.############################################