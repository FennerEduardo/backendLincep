const jwt = require('jsonwebtoken');
const Token = require('../models/Token');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {

    const authHeader = req?.headers?.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Debe estar autenticado para realizar esta consulta.' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Acceso no autorizado. Token no proporcionado.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.APP_SECRET_KEY_AUTH);
        const storedToken = await Token.findOne({ where: { token } });
        if (!storedToken) {
            return res.status(401).json({ message: 'Acceso no autorizado. Token no encontrado.' });
        }

        const user = await User.findOne({ where: { id: decoded.id } });

        if (!user) {
            return res.status(401).json({ message: 'Acceso no autorizado. Usuario no encontrado.' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error de autenticación:', error);
        return res.status(401).json({ message: 'Acceso no autorizado. Token inválido.' });
    }
};

module.exports = authMiddleware;
