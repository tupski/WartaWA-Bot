const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
    
    if (!token) {
        return res.status(401).json({ 
            status: 'error',
            message: 'Access denied. No token provided.' 
        });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(403).json({ 
            status: 'error',
            message: 'Invalid token.' 
        });
    }
};

module.exports = { authenticateToken };
