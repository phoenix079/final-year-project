const upload = require("../config/storage");
// const { ErrorResponse } = require("../utils/errorResponse");

const handleFileUpload = (fieldName) => {
  return (req, res, next) => {
    upload.array(fieldName)(req, res, (err) => {
      if (err) {
        return next(new ErrorResponse(err.message, 400));
      }
      next();
    });
  };
};

module.exports = {
  handleFileUpload,
};
