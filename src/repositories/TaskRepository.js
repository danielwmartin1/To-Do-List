// repositories/TaskRepository.js
import Tasks from '../models/Tasks.js';

class TaskRepository {
  // Get all tasks
  async getAll() {
    try {
      return await Tasks.find();
    } catch (error) {
      console.error('Error retrieving tasks:', error);
      throw error;
    }
  }

  // Get a single task
  async getById(id) {
    try {
      return await Tasks.findById(id);
    } catch (error) {
      console.error(`Error retrieving task with id ${id}:`, error);
      throw error;
    }
  }

  // Add a new task
  async add(taskData) {
    try {
      const task = new Tasks(taskData);
      return await task.save();
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  }

  // Update a task
  async update(id, taskData) {
    try {
      return Tasks.findByIdAndUpdate(id, taskData, { new: true });
    } catch (error) {
      console.error(`Error updating task with id ${id}:`, error);
      throw error;
    }
  }

  async completed(id, taskData) {
    try {
      console.log('completedTask', id, taskData);
      const completedTask = await Tasks.findByIdAndUpdate(id, taskData, { new: true });
      return completedTask;
    } catch (error) {
      console.error(`Error updating task with id ${id}:`, error);
      throw error;
    }
  }

  // Delete a task
  async delete(id) {
    try {
      return await Tasks.findByIdAndDelete(id);
    } catch (error) {
      console.error(`Error deleting task with id ${id}:`, error);
      throw error;
    }
  }
}

export default TaskRepository;
