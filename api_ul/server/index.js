const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const path = require("path");
const fileRoutes = require("./routes/fileRoutes");
const mlRoutes = require("./routes/mlRoutes");
const dotenv = require("dotenv");
const { errorHandler } = require("./middlewares/errorHandler");
const authRoute = require("./routes/userRoutes");
const app = express();

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
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/files", fileRoutes);
app.use("/api/ml", mlRoutes);

// Error handling middleware
app.use(errorHandler);

app.use("/api/auth",authRoute);

app.listen(5000, ()=>{
  console.log(`Server running`)
});

module.exports = app;
