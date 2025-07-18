const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT;
const APP_URL = process.env.REACT_APP_URL;
const app = express();
app.use(
  cors({
    origin:  APP_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

app.use((req, res, next) => {
  console.log("Request:", req.method, req.url, req.body);
  next();
});
app.get("/test", (req, res) => res.send("Server is up!"));
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
