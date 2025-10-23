// server.js
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware (optional)
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello, world! 👋 This is a sample Node.js app.");
});

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the API", status: "success" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
