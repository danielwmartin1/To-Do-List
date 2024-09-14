// repositories/TaskRepository.js
import Tasks from '../models/Tasks.js';
import { formatInTimeZone } from 'date-fns-tz';

const formatDate = (date) => date ? formatInTimeZone(new Date(date), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') : null;

class TaskRepository {
  async getAll() {
    try {
      const tasks = await Tasks.find();
      return tasks.map(task => ({
        ...task.toObject(),
        dueDate: formatDate(task.dueDate),
        createdAt: formatDate(task.createdAt),
        updatedAt: formatDate(task.updatedAt),
        completedAt: formatDate(task.completedAt),
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new Error('Could not fetch tasks');
    }
  }

  async getById(id) {
    try {
      const task = await Tasks.findById(id);
      if (!task) return null;
      return {
        ...task.toObject(),
        dueDate: formatDate(task.dueDate),
        createdAt: formatDate(task.createdAt),
        updatedAt: formatDate(task.updatedAt),
        completedAt: formatDate(task.completedAt),
      };
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
      });
      await task.save();
      return {
        ...task.toObject(),
        dueDate: formatDate(task.dueDate),
        createdAt: formatDate(task.createdAt),
        updatedAt: formatDate(task.updatedAt),
        completedAt: formatDate(task.completedAt),
      };
    } catch (error) {
      console.error('Error adding task:', error);
      throw new Error('Could not add task');
    }
  }

  async update(taskId, updatedTask) {
    try {
      const task = await Tasks.findByIdAndUpdate(taskId, {
        ...updatedTask,
        dueDate: updatedTask.dueDate ? new Date(updatedTask.dueDate) : null,
        updatedAt: new Date(),
      }, { new: true });
      if (!task) return null;
      return {
        ...task.toObject(),
        dueDate: formatDate(task.dueDate),
        createdAt: formatDate(task.createdAt),
        updatedAt: formatDate(task.updatedAt),
        completedAt: formatDate(task.completedAt),
      };
    } catch (error) {
      console.error(`Error updating task with id ${taskId}:`, error);
      throw new Error('Could not update task');
    }
  }
}

export default TaskRepository;