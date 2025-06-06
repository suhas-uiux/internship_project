
# 🧑‍💻 Interview_Prep Setup Guide (MERN Stack)

## 📁 Project Structure

```
internship_project/
├── backend/              # Node.js + Express + MongoDB API
│   └── package.json      # Backend dependencies listed here
├── frontend/             # React + Vite + Tailwind client
│   └── package.json      # Frontend dependencies listed here
└── README.md
```

---

## 🚀 How to Setup the Project

### ✅ Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (local or cloud)

---

## 📦 Backend Setup (`/backend`)

### Step 1: Navigate to backend folder

```bash
cd backend
```

### Step 2: Initialize `package.json` if not already done

```bash
npm init -y
```

### Step 3: Install backend dependencies

```bash
npm install bcryptjs@3.0.2
npm install cors@2.8.5
npm install dotenv@16.5.0
npm install express@5.1.0
npm install jsonwebtoken@9.0.2
npm install mongoose@8.15.0
```

### Step 4 (Optional): For development auto-reload

```bash
npm install --save-dev nodemon
```

### Step 5: Create `.env` file (if needed)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/yourdbname
JWT_SECRET=yourSecretKey
```

---

## 🌐 Frontend Setup (`/frontend`)

### Step 1: Navigate to frontend folder

```bash
cd frontend
```

### Step 2: Initialize `package.json` if not already done

```bash
npm init -y
```

### Step 3: Install frontend dependencies

You can copy and run these one by one:

```bash
npm install @eslint/js@9.27.0
npm install @tailwindcss/typography@0.5.16
npm install @types/react-dom@19.1.5
npm install @types/react@19.1.5
npm install @vitejs/plugin-react@4.5.0
npm install autoprefixer@10.4.21
npm install axios@1.9.0
npm install eslint-plugin-react-hooks@5.2.0
npm install eslint-plugin-react-refresh@0.4.20
npm install eslint@9.27.0
npm install globals@16.1.0
npm install highlight.js@11.11.1
npm install postcss@8.5.3
npm install react-dom@19.1.0
npm install react-markdown@10.1.0
npm install react-router-dom@7.6.0
npm install react@19.1.0
npm install rehype-highlight@7.0.2
npm install tailwindcss@3.4.17
npm install vite@6.3.5
```

Or install them all together:

```bash
npm install @eslint/js@9.27.0 @tailwindcss/typography@0.5.16 @types/react-dom@19.1.5 @types/react@19.1.5 @vitejs/plugin-react@4.5.0 autoprefixer@10.4.21 axios@1.9.0 eslint-plugin-react-hooks@5.2.0 eslint-plugin-react-refresh@0.4.20 eslint@9.27.0 globals@16.1.0 highlight.js@11.11.1 postcss@8.5.3 react-dom@19.1.0 react-markdown@10.1.0 react-router-dom@7.6.0 react@19.1.0 rehype-highlight@7.0.2 tailwindcss@3.4.17 vite@6.3.5
```

---

## 🛠 Run the Project

### Start Backend:

```bash
cd backend
nodemon server.js
```

### Start Frontend:

```bash
cd frontend
npm run dev
```

---

## 💡 Notes

- Make sure MongoDB is running before starting the backend.
- Keep frontend and backend in **separate terminals** while developing.
