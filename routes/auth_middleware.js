
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const secretKey = process.env.SECRET_KEY; 
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return  res.status(401).json({ message: "Please Login"}); ;
  
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }

        req.user = user;
        next();
    });
  }
  
module.exports = authenticateToken;
