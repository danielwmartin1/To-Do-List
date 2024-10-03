import Tasks from '../models/Tasks.js';
import { formatInTimeZone } from 'date-fns-tz';
import mongoose from 'mongoose';

class TaskRepository {
  formatTaskDates(task) {
    const timezone = 'UTC';
    return {
      ...task.toObject(),
      dueDate: task.dueDate ? formatInTimeZone(new Date(task.dueDate), timezone, 'MMMM d, yyyy h:mm a zzz') : null,
      createdAt: task.createdAt ? formatInTimeZone(new Date(task.createdAt), timezone, 'MMMM d, yyyy h:mm a zzz') : null,
      updatedAt: task.updatedAt ? formatInTimeZone(new Date(task.updatedAt), timezone, 'MMMM d, yyyy h:mm a zzz') : null,
      completedAt: task.completedAt ? formatInTimeZone(new Date(task.completedAt), timezone,'MMMM d, yyyy h:mm a zzz') : null,
      priority: task.priority || 'low'
    };
  }

  async getAll() {
    try {
      const tasks = await Tasks.find();
      return tasks.map(task => this.formatTaskDates(task));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new Error('Could not fetch tasks');
    }
  }

  async getById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid task ID');
    }
    try {
      const task = await Tasks.findById(id);
      if (!task) return null;
      return this.formatTaskDates(task);
    } catch (error) {
      console.error(`Error fetching task with id ${id}:`, error);
      throw new Error('Could not fetch task');
    }
  }

  async add(newTask) {
    try {
      const task = new Tasks({
        ...newTask,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null,
        priority: newTask.priority || 'low',
        files: newTask.files || [] // Add this line
      });
      await task.save();
      return this.formatTaskDates(task);
    } catch (error) {
      console.error('Error adding task:', error);
      throw new Error('Could not add task');
    }
  }

  async replace(taskId, updatedTask) {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new Error('Invalid task ID');
    }
    try {
      const task = await Tasks.findByIdAndUpdate(taskId, updatedTask, { new: true });
      if (!task) return null;
      return this.formatTaskDates(task);
    } catch (error) {
      console.error(`Error replacing task with id ${taskId}:`, error);
      throw new Error('Could not replace task');
    }
  }

  async update(taskId, updatedTask) {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new Error('Invalid task ID');
    }
    try {
      const task = await Tasks.findByIdAndUpdate(taskId, updatedTask, { new: true });
      if (!task) return null;
      return this.formatTaskDates(task);
    } catch (error) {
      console.error(`Error updating task with id ${taskId}:`, error);
      throw new Error('Could not update task');
    }
  }

  async delete(taskId) {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new Error('Invalid task ID');
    }
    try {
      const task = await Tasks.findByIdAndDelete(taskId);
      if (!task) return null;
      return this.formatTaskDates(task);
    } catch (error) {
      console.error(`Error deleting task with id ${taskId}:`, error);
      throw new Error('Could not delete task');
    }
  }

  async deleteFile(taskId, fileName) {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      throw new Error('Invalid task ID');
    }
    try {
      const task = await Tasks.findById(taskId);
      if (!task) return null;

      task.files = task.files.filter(file => file !== fileName);
      await task.save();

      return this.formatTaskDates(task);
    } catch (error) {
      console.error(`Error deleting file from task with id ${taskId}:`, error);
      throw new Error('Could not delete file from task');
    }
  }
  
}

export default TaskRepository;