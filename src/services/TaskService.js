// services/TaskService.js
import TaskRepository from '../repositories/TaskRepository.js';
const taskRepository = new TaskRepository();

class TaskService {
  async getAllTasks() {
    return await taskRepository.getAll();
  }

  async getTaskById(id) {
    return await taskRepository.getById(id);
  }

  async createTask(taskData) {
    return await taskRepository.add(taskData);
  }

  async updateTask(id, taskData) {
    return await taskRepository.update(id, taskData);
  }

  async deleteTask(id) {
    return await taskRepository.delete(id);
  }
}

export default TaskService;

