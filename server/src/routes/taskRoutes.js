const express = require('express');
const taskController = require('../controllers/taskController');
const {
  createTaskValidator,
  updateTaskValidator,
  statusValidator,
  idParamValidator,
  listQueryValidator,
} = require('../middleware/validateTask');

const router = express.Router();

router.get('/', listQueryValidator, taskController.listTasks);
router.get('/:id', idParamValidator, taskController.getTaskById);
router.post('/', createTaskValidator, taskController.createTask);
router.put('/:id', updateTaskValidator, taskController.updateTask);
router.patch('/:id/status', statusValidator, taskController.updateTaskStatus);
router.delete('/:id', idParamValidator, taskController.deleteTask);

module.exports = router;
