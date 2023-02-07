const jwt = require('jsonwebtoken')
const { AUTH_CONF } = process.env

verifyToken = (req, res, next) => {
  let token;
  try {
    token = req.headers['authorization'].split(' ')[1];
  } catch (e) {
    return res.status(403).send({ message: 'No token provided' });
  }
  if (!token) {
    return res.status(403).send({ message: 'No token provided' });
  }
  jwt.verify(token, AUTH_CONF, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    req.udata = decoded.udata;
  });
  next();
}

const authJWT = {
  verifyToken: verifyToken,
};

module.exports = authJWT;