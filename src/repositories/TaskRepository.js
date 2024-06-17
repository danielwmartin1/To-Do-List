// repositories/TaskRepository.js
import Tasks from '../models/Tasks.js';

class TaskRepository {
  async getAll() {
    return await Tasks.find();
  }

  async getById(id) {
    return await Tasks.findById(id);
  }

  async add(taskData) {
    const task = new Tasks(taskData);
    return await task.save();
  }

  async update(id, taskData) {
    return await Tasks.findByIdAndUpdate(id, taskData, { new: true });
  }

  async delete(id) {
    return await Tasks.findByIdAndDelete(id);
  }
}

export default TaskRepository;

