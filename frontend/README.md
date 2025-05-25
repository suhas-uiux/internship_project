# 🧩 Multi-Tenant Task Manager (MERN Stack)

A **multi-tenant task management** application built using the **MERN stack** (MongoDB, Express, React, Node.js). It includes **role-based access**, **organization-based data isolation**, and a clean frontend built with **Tailwind CSS**.

## 🚀 Features

- **Register/Login** with JWT-based authentication
- **Multi-tenant architecture**: users belong to organizations
- **Role-based access control**:
  - **Admin**: Full control (manage tasks, promote members to managers)
  - **Manager**: View all member tasks, create/update tasks
  - **Member**: View/update only their own assigned tasks
- **Task CRUD operations**
- **Dashboard** for each role
- **Clean UI** with Tailwind CSS
- **Protected routes** using auth middleware

---

## 🗂️ Folder Structure

```
mern-multi-tenant-task-manager/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── App.jsx
│   ├── index.html
├── .env
```

---

## 📦 Backend Setup

### 📁 Installed Backend Dependencies

```bash
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
npm install nodemon --save-dev
```

### ▶️ Run Backend Server

```bash
cd backend
npm run dev
```

Ensure your `.env` includes:

```env
PORT=5000
MONGO_URI=mongodb+srv://<your_connection_string>
JWT_SECRET=your_jwt_secret
```

---

## 💻 Frontend Setup

### 📁 Installed Frontend Dependencies

```bash
npm install axios react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Tailwind Setup in `tailwind.config.js`

```js
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
theme: {
  extend: {},
},
plugins: [],
```

### Include Tailwind in `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### ▶️ Run Frontend

```bash
cd frontend
npm run dev
```

---

## 🌐 Application Routes

### 🧠 Auth

| Method | Endpoint        | Description           |
|--------|------------------|-----------------------|
| POST   | `/api/auth/register` | Register user + org |
| POST   | `/api/auth/login`    | Login + get JWT     |

### ✅ Tasks

| Method | Endpoint            | Role Access     |
|--------|----------------------|-----------------|
| GET    | `/api/tasks`         | Admin/Manager/Member |
| POST   | `/api/tasks`         | Admin/Manager   |
| PUT    | `/api/tasks/:id`     | Admin/Manager/Member (if own task) |
| DELETE | `/api/tasks/:id`     | Admin only      |

---

## 🔐 Middleware

- **authenticate.js** – Verifies JWT and attaches user to request
- **authorizeRoles.js** – Restricts access by role (Admin, Manager, Member)

---

## 📆 Progress Overview



- Scaffolded project with `Vite` for React + Node/Express backend
- Set up MongoDB Atlas and connected to backend
- Built **Register** and **Login** routes
- Generated JWT and tested login with Postman



- Added **authentication middleware** to protect routes
- Added **role-based access control**
- Implemented **task CRUD routes** (Admin/Manager can create, Members can update own)
- Created frontend pages:
  - Login
  - Register
  - Dashboard (renders based on user role)
- Set up Axios and React Router DOM
- Designed UI using Tailwind CSS

---

## 🔧 Scripts

### Backend (`backend/package.json`)
```json
"scripts": {
  "dev": "nodemon server.js"
}
```

### Frontend (`frontend/package.json`)
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

---

## 🧪 Testing

Use Postman to test:

- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Attach the returned token as `Authorization: Bearer <token>` in headers for protected routes.

---

## 📌 Environment Variables Example

Create a `.env` file in `backend/`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.4e2b0.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
```

---

## 👨‍💻 Author

Built by a **2nd year B.Tech student** for learning and portfolio purposes.

---

## 📣 Future Enhancements

- Email invite system for organization join
- Task deadlines and statuses
- Comments/Notes per task
- Pagination and search
- UI improvements

---
# Task Manager

Welcome to the **Task Manager** app!

## 🔐 Authentication Screens

### Home Page
![Home Page](./frontend/src/assets/Screenshot%202025-05-25%202018...png)

### Login Page
![Login Page](./frontend/src/assets/Screenshot%202025-05-25%202019...png)

### Register Page
![Register Page](./frontend/src/assets/Screenshot%202025-05-25%202019...png)



