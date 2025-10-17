import jwt from 'jsonwebtoken';

function verifyToken(req, res, next) {
    const authHeaders = req.headers['authorization'];
    const token = authHeaders && authHeaders.split(' ')[1];

    if (!token){
        console.log('no token provided');
        return res.status(401).json({message: 'Access denied, no token provided'})
    }

    try {
        console.log(`token provided: ${token}`);
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({message: 'Invalid or expired token'});
    }
    
}

export default verifyToken;