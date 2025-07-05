# 🧩 Team Collaboration Board

A minimal Task Board Application which is task management app built using the **MERN Stack** (MongoDB, Express, React, Node.js). 
---

## 🚀 Features

- ✅ Create and manage multiple Boards
- 📝 Add/Edit/Delete Tasks within each board
- 🏷️ Assign Priority, Due Dates, and Team Members
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


### ⚙️ Backend Setup

```bash
cd backend
npm install
# Create a `.env` file
echo "PORT=3030" > .env
echo "MONGODB_URI=mongodb://localhost:27017/teamboard" >> .env

npm run dev  # or: node index.js


