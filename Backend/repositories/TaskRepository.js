import Tasks from '../models/Tasks.js';
import { formatInTimeZone } from 'date-fns-tz';

class TaskRepository {
  formatTaskDates(task, timezone) {
    return {
      ...task.toObject(),
      dueDate: task.dueDate ? formatInTimeZone(new Date(task.dueDate), timezone, 'MMMM dd, yyyy hh:mm:ss a zzz') : null,
      createdAt: task.createdAt ? formatInTimeZone(new Date(task.createdAt), timezone, 'MMMM dd, yyyy hh:mm:ss a zzz') : null,
      updatedAt: task.updatedAt ? formatInTimeZone(new Date(task.updatedAt), timezone, 'MMMM dd, yyyy hh:mm:ss a zzz') : null,
      completedAt: task.completedAt ? formatInTimeZone(new Date(task.completedAt), timezone, 'MMMM dd, yyyy hh:mm:ss a zzz') : null,
    };
  }

  async getAll(timezone) {
    try {
      const tasks = await Tasks.find();
      return tasks.map(task => this.formatTaskDates(task, timezone));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new Error('Could not fetch tasks');
    }
  }

  async getById(id, timezone) {
    try {
      const task = await Tasks.findById(id);
      if (!task) return null;
      return this.formatTaskDates(task, timezone);
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
      return this.formatTaskDates(task, 'UTC');
    } catch (error) {
      console.error('Error adding task:', error);
      throw new Error('Could not add task');
    }
  }

  async update(taskId, updatedTask, timezone) {
    try {
      const now = new Date();
      const formattedDate = formatInTimeZone(now, timezone, 'MMMM dd, yyyy hh:mm:ss a zzz');

      const task = await Tasks.findByIdAndUpdate(taskId, {
        ...updatedTask,
        dueDate: updatedTask.dueDate ? new Date(updatedTask.dueDate) : null,
        updatedAt: formattedDate,
      }, { new: true });
      if (!task) return null;
      return this.formatTaskDates(task, timezone);
    } catch (error) {
      console.error(`Error updating task with id ${taskId}:`, error);
      throw new Error('Could not update task');
    }
  }
}

export default TaskRepository;