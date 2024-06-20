// repositories/TaskRepository.js
import Tasks from '../models/Tasks.js';

class TaskRepository {
  // Get all tasks
  async getAll() {
    return await Tasks.find();
  }
// Get a single task
  async getById(id) {
    return await Tasks.findById(id);
  }
// Add a new task
  async add(taskData) {
    const task = new Tasks(taskData);
    return await task.save();
  }
// Update a task
  async update(id, taskData) {
    return await Tasks.findByIdAndUpdate(id, taskData, { new: true });
  }
// Delete a task
  async delete(id) {
    return await Tasks.findByIdAndDelete(id);
  }
}

export default TaskRepository;

