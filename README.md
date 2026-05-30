# TaskSphere - Full-Stack Kanban Task Manager

TaskSphere is a premium, responsive Kanban-style Task Manager application built with **React (Vite)** on the frontend and **Node/Express + MongoDB** on the backend. It features custom user authentication, interactive dashboard metrics, debounced search, task filters, and smooth HTML5 drag-and-drop stage updates.

---

## Technical Stack

- **Frontend**: React (Vite), Lucide React (Icons), Vanilla CSS (Custom Glassmorphism design system)
- **Backend**: Node.js, Express.js, JWT (JSON Web Tokens), bcryptjs (Password hashing)
- **Database**: MongoDB + Mongoose ODM
- **Development Tooling**: Nodemon (Live reloading for backend)

---

## Features

1. **User Authentication (JWT)**:
   - Registration and secure Login flow.
   - Secure route protection on the backend.
   - Client session persistence using JWT.
2. **Interactive Kanban Board**:
   - Drag & Drop cards between columns (**Todo**, **In Progress**, **Done**).
   - Dynamic dropzone indicators with border-dash changes and glow on hover/drag.
   - Fallback action-arrows on task cards for touch-screen mobile devices.
3. **Advanced Dashboard Stats**:
   - Responsive statistics panel indicating total, pending, and completed counts.
   - Radial SVG progress completion meter showing work efficiency.
   - Warning cards tracking high priority and overdue tasks.
4. **Search and Filter Controls**:
   - Search tasks dynamically by Title or Description.
   - Real-time client-side search input debouncing to minimize database queries.
   - Filter board columns by Priority level (Low, Medium, High).
5. **Task Lifecycle Management (CRUD)**:
   - Open a detailed modal to create a task or modify details (Title, Description, Stage, Priority, Due Date).
   - Quick in-place deletion with user confirmation prompts.
6. **Aesthetics & Responsiveness**:
   - Deep-space dark theme utilizing backdrop blur effects (`backdrop-filter`).
   - Neon accent borders and hover glow states.
   - Form-field outline transitions and custom scrollbars.
   - Grid adapting to mobile, tablet, and desktop viewports.

---

## Technical Decisions & Tradeoffs

### 1. Database Choice: MongoDB over SQL
* **Decision**: Switched from SQLite to MongoDB (via Mongoose) to accommodate the user's preference.
* **Tradeoff**: MongoDB's document-based store is ideal for tasks with flexible structures (e.g., adding subtasks or labels later). Mongoose provides clean model-level validation (like email regex and stage enumerations) which reduces controller-level boilerplate.

### 2. Styling: Pure Vanilla CSS over Tailwind
* **Decision**: Written using pure CSS in `src/index.css` without relying on utility libraries (Tailwind) or UI packages (Material UI, Bootstrap).
* **Rationale**: Custom stylesheet allows full visual fine-tuning of glassmorphic panels, keyframe entry animations, scrollbar overlays, and radial background gradients. It keeps dependencies slim and page-load fast.

### 3. State Management & Optimistic UI Updates
* **Decision**: App state is maintained at the parent `App.jsx` level, passing callback functions down. For task movement, an **Optimistic UI update** is triggered.
* **Tradeoff**: When you drop a card into a new column, the UI moves the card instantly before the API call finishes. If the server request succeeds, the action remains silent. If it fails, the task reverts back to its previous column and a toast notification displays. This eliminates drag-and-drop lag.

### 4. Search Debouncing
* **Decision**: Implemented a `useRef` based timeout debouncer (300ms) on the search input in `App.jsx`.
* **Rationale**: If a user types "Database Schema", the board fetches tasks once they finish typing, rather than sending 15 separate database requests for each keypress.

### 5. Touch Screen Alternative Navigation
* **Decision**: Included quick left/right shift arrow buttons on task cards.
* **Tradeoff**: Standard HTML5 drag-and-drop is occasionally problematic or unsupported on mobile Safari/Chrome. Providing action arrows makes the board fully usable on mobile layouts.

### 6. Token Authentication Storage
* **Decision**: The JWT token returned on login is stored in the browser's `localStorage` and sent in the HTTP `Authorization` header.
* **Tradeoff**: For a simple cross-domain deployment (e.g. Vercel frontend talking to Render backend), CORS-safe `localStorage` is easier to configure than `SameSite=None` Secure HTTP-only cookies, though cookies remain the gold standard for production security against XSS.

---

## Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB running locally (default: `mongodb://localhost:27017/taskmanager`) OR a MongoDB Atlas URI string.

### 1. Backend Setup
1. Open terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `/backend` folder:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
   JWT_SECRET=supersecretkeyfortaskmanagerapplicationauth
   ```
   *(Note: You can replace `MONGO_URI` with a cloud MongoDB Atlas URI if you prefer).*
4. Run the server in development mode:
   ```bash
   npm run dev
   ```
   The backend should start on port `5000` with the log: `MongoDB Connected Successfully`.

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Run the development build:
   ```bash
   npm run dev
   ```
4. Open the displayed address (usually `http://localhost:5173`) in your browser.

---

## Deployment Guidelines

### 1. Database (MongoDB Atlas)
1. Register for a free account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared cluster.
3. Add a database user with password permissions.
4. Set IP Access List to `0.0.0.0/0` (allow connections from anywhere) so hosting platforms can reach it.
5. Copy the driver connection string (e.g. `mongodb+srv://<user>:<password>@cluster0.abcde.mongodb.net/taskmanager?retryWrites=true&w=majority`).

### 2. Backend (Render / Railway)
To deploy the backend to a free host like **Render**:
1. Connect your Github repository.
2. Select **Web Service**.
3. Set Environment to `Node`.
4. Set Build Command: `npm install` (run in the `/backend` directory).
5. Set Start Command: `npm start` (run in the `/backend` directory).
6. Under **Environment Variables**, add:
   - `MONGO_URI` = *(Your MongoDB Atlas connection string)*
   - `JWT_SECRET` = *(Choose a strong secret phrase)*
   - `PORT` = `10000` (Render handles this automatically, but good to declare)

### 3. Frontend (Vercel / Netlify)
To deploy the frontend to a free host like **Vercel**:
1. Install Vercel CLI or link your repo directly on [vercel.com](https://vercel.com).
2. Configure settings:
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Under **Environment Variables**, add:
   - `VITE_API_URL` = *(URL of your deployed backend service, e.g. `https://task-manager-backend.onrender.com/api`)*
4. Click deploy. Your frontend live link will be generated!
