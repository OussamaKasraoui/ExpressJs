const jwt     = require('jsonwebtoken');
const secret  = require('./_conf').secretOrKey;

const withAuth = function(req, res, next) {  

     const token = req.headers.authorization;

  if (!token) {
    // Original res.status(401).send('Unauthorized: No token provided');
    res.status(401).json({'error' :'Unauthorized: No token provided'});
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        // Original res.status(401).send('Unauthorized: Invalid token');
        res.status(401).json({'error' : err});
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
};

module.exports = withAuth;