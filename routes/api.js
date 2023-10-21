const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const ProjectController = require('../controllers/ProjectController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.route('/users')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router.route('/users/:id')
  .get(userController.getUserById)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

router.post('/current-user', userController.getCurrentUser);

router.route('/projects')
  .get(ProjectController.getAllProjects)
  .post(ProjectController.createProject);

router.route('/projects/:id')
  .get(ProjectController.getProjectById)
  .put(ProjectController.updateProject)
  .delete(ProjectController.deleteProject);

module.exports = router;
