import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET 

export function signJWT(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
}

export function verifyJWT(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}
