// repositories/TaskRepository.js
import Tasks from '../models/Tasks.js';
import { formatInTimeZone } from 'date-fns-tz';

const formatDate = (date) => date ? formatInTimeZone(new Date(date), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') : null;

class TaskRepository {
  formatTaskDates(task) {
    return {
      ...task.toObject(),
      dueDate: formatDate(task.dueDate),
      createdAt: formatDate(task.createdAt),
      updatedAt: formatDate(task.updatedAt),
      completedAt: formatDate(task.completedAt),
    };
  }

  async getAll() {
    try {
      const tasks = await Tasks.find();
      return tasks.map(this.formatTaskDates);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new Error('Could not fetch tasks');
    }
  }

  async getById(id) {
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
      });
      await task.save();
      return this.formatTaskDates(task);
    } catch (error) {
      console.error('Error adding task:', error);
      throw new Error('Could not add task');
    }
  }

  async update(taskId, updatedTask) {
    try {
      const now = new Date();
      const formattedDate = formatDate(now);
  
      const task = await Tasks.findByIdAndUpdate(taskId, {
        ...updatedTask,
        dueDate: updatedTask.dueDate ? new Date(updatedTask.dueDate) : null,
        updatedAt: formattedDate,
      }, { new: true });
      if (!task) return null;
      return this.formatTaskDates(task);
    } catch (error) {
      console.error(`Error updating task with id ${taskId}:`, error);
      throw new Error('Could not update task');
    }
  }
}
export default TaskRepository;
