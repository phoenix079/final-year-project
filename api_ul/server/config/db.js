module.exports = {
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/file_upload",
  PORT: process.env.PORT || 5000,
};
