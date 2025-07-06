const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const PORT = process.env.PORT;

const app = express();
app.use(
  cors({
    origin: "https://task-board-frontend-five.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

app.use((req, res, next) => {
  console.log("Request:", req.method, req.url, req.body);
  res.send('<h1>Server is Running</h1>');
  res.send(req.method, req.url, req.body)
  next();
});

// app.get("/test", (req, res) => res.send("Server is up!"));

// Routes
const boardRoutes = require("./routes/boardRoutes");
const taskRoutes = require("./routes/taskRoutes");

app.use("/boards", boardRoutes);
app.use("/tasks", taskRoutes);

// DB & Server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
