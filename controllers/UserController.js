const bcrypt = require('bcryptjs');
const User = require('../models/User');


const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ include: 'Projects' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};


const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id, { include: Project });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};


const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await User.create({
      username: username,
      email: email,
      password: hashedPassword
    });
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
};


const updateUser = async (req, res) => {
  const id = req.params.id;
  const { username, email, password } = req.body;
  try {
    const user = await User.findByPk(id);
    if (user) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      user.username = username;
      user.email = email;
      user.password = hashedPassword;
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};


const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      res.json({ message: 'Usuario eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
