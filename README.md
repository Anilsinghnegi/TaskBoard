# 🧩 Team Collaboration Board

A minimal Trello/Asana-style task management app built using the **MERN Stack** (MongoDB, Express, React, Node.js). Team members can create boards, manage tasks, assign priorities, track progress, and collaborate effectively.

---

## 🚀 Features

- ✅ Create and manage multiple Boards
- 📝 Add/Edit/Delete Tasks within each board
- 🏷️ Assign Priority, Due Dates, and Team Members
- 🔄 Drag-and-drop (future enhancement)
- 📊 Group tasks by status: To Do, In Progress, Done
- 🎨 Clean, responsive UI using Tailwind CSS
- 💡 RESTful API powered by Express & MongoDB

---

## 🧱 Tech Stack

| Frontend | Backend | Database | Others |
|----------|---------|----------|--------|
| React.js | Node.js | MongoDB  | Axios, Lucide-React, Tailwind CSS |

---

## 🛠️ Setup Instructions

### 🔌 Prerequisites

- Node.js & npm
- MongoDB (local or cloud e.g., Atlas)
- Git
- [GitHub CLI (`gh`)](https://cli.github.com/) *(optional)*

### ⚙️ Backend Setup

```bash
cd backend
npm install
# Create a `.env` file
echo "PORT=3030" > .env
echo "MONGODB_URI=mongodb://localhost:27017/teamboard" >> .env

npm run dev  # or: node index.js


