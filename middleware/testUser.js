const { BadRequestError } = require("../errors");

// Used in routes to prevent some CRUD functionality
const testUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError("Test User. Read Only!");
  }
  next();
};

module.exports = testUser;
