const  Project  = require('../models/Project');
const User = require('../models/User');

const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.findAll({ include: User });
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error al obtener proyectos:', error);
        res.status(500).json({ message: 'Error al obtener proyectos.' });
    }
};

const createProject = async (req, res) => {
    const { name, description, user_id } = req.body;
    try {
        const newProject = await Project.create({ name, description, user_id });
        res.status(201).json(newProject);
    } catch (error) {
        console.error('Error al crear proyecto:', error);
        res.status(500).json({ message: 'Error al crear proyecto.' });
    }
};


const getProjectById = async (req, res) => {
    const id = req.params.id;
    try {
        const project = await Project.findByPk(id, { include: User });
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }
        res.status(200).json(project);
    } catch (error) {
        console.error('Error al obtener proyecto por ID:', error);
        res.status(500).json({ message: 'Error al obtener proyecto por ID.' });
    }
};


const updateProject = async (req, res) => {
    const id = req.params.id;
    const { name, description, user_id } = req.body;
    try {
        const project = await Project.findByPk(id);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }
        project.name = name;
        project.description = description;
        project.user_id = user_id;
        await project.save();
        res.status(200).json(project);
    } catch (error) {
        console.error('Error al actualizar proyecto:', error);
        res.status(500).json({ message: 'Error al actualizar proyecto.' });
    }
};


const deleteProject = async (req, res) => {
    const id = req.params.id;
    try {
        const project = await Project.findByPk(id);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }
        await project.destroy();
        res.status(200).json({ message: 'Proyecto eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar proyecto:', error);
        res.status(500).json({ message: 'Error al eliminar proyecto.' });
    }
};

module.exports = {
    getAllProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject
};
