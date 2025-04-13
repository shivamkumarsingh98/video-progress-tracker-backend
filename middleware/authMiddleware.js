const jwt = require("jsonwebtoken");

module.exports = authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // get token after "Bearer"

  if (!token) return res.status(400).json("Invalid Token");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json("Token is not valid");
    req.user = user;
    next();
  });
};
