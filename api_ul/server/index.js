const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const path = require("path");
const fileRoutes = require("./routes/fileRoutes");
const mlRoutes = require("./routes/mlRoutes");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const app = express();
const { connectDB } = require("./lib/db");
const { error } = require("console");

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 5000;
app.set("trust proxy", 1);
// Connect to the database

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Logging
app.use(morgan("dev"));

// Enable CORS
const allowedOrigins = [
  "https://final-year-project-p013.onrender.com",
  "http://localhost:5000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
// app.use("/api/files", fileRoutes);
// app.use("/api/ml", mlRoutes);

// Error handling middleware
// app.use(errorHandler);

//AuthRoutes
app.use("/api/auth", authRoutes);

// File upload routes
app.use("/api", fileRoutes);

// Machine learning routes
app.use("/api", mlRoutes);

//Error Handler
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
};
app.use(errorHandler);

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
});

module.exports = app;
