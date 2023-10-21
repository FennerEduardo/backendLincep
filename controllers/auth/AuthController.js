require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const User = require('../../models/User');
const Token = require('../../models/Token');


// Método de registro
const register = async (req, res) => {
    const { username, email, password } = req.body;

    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        password_confirmation: Joi.any().valid(Joi.ref('password')).required()
    }).with('password', 'password_confirmation');


    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {

        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).send('El usuario ya está registrado.');
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = await User.create({
            username: username,
            email: email,
            password: hashedPassword
        });

        res.status(201).json({ user: newUser, message: 'Usuario registrado correctamente.' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).send('Error al registrar usuario.');
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;

    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    const { error } = schema.validate({ email, password });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {

        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }


        const existingToken = await Token.findOne({ where: { user_id: user.id } });
        if (existingToken) {
            return res.status(200).json({ message: 'El usuario ya ha iniciado sesión.', token: existingToken.token, expiresIn: 3600 });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {

            if (err || !isMatch) {
                return res.status(401).json({ message: 'Credenciales inválidas.' });
            }

            const token = jwt.sign({ id: user.id, email: user.email }, process.env.APP_SECRET_KEY_AUTH, {
                expiresIn: '1h'
            });

            Token.create({ user_id: user.id, token: token, expires_in: 3600 });

            res.status(200).json({ token: token, expires_n: 3600 });
        });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ message: 'Error en el inicio de sesión.' });
    }
};

const logout = async (req, res) => {
    const authHeader = req?.headers?.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Debe estar autenticado para realizar esta consulta.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const storedToken = await Token.findOne({ where: { token: token } });
        if (!storedToken) {
            return res.status(401).json({ message: 'Token inválido o expirado.' });
        }

        await Token.destroy({ where: { token: token } });

        res.status(200).json({ message: 'Cierre de sesión exitoso.' });
    } catch (error) {
        console.error('Error en el cierre de sesión:', error);
        res.status(500).json({ message: 'Error en el cierre de sesión.' });
    }
};

module.exports = { register, login, logout };