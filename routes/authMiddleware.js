
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const secretKey = process.env.SECRET_KEY; 
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(`🚀 log:secretKey`,secretKey )
    console.log(`🚀 log:token`,token )
    if (token == null) return  res.status(401).json({ message: "Please Login"}); ;
  
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
          console.log(`🚀 log:sendStatus403`, ); 
          return res.sendStatus(403);
        }
        console.log(`🚀 log:sendStatus-pass`, ); 

        req.user = user;
        next();
    });
  }
  
module.exports = authenticateToken;
