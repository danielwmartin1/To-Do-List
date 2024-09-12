import { formatInTimeZone, format, utcToZonedTime } from 'date-fns-tz';
import Tasks from '../models/Tasks.js';

const TIMEZONE = 'America/New_York';
const DATE_FORMAT = 'MMMM dd, yyyy hh:mm:ss a zzz';

class TaskRepository {
  formatDate(date) {
    return date ? formatInTimeZone(new Date(date), TIMEZONE, DATE_FORMAT) : null;
  }

  async getAll() {
    const tasks = await Tasks.find();
    return tasks.map(task => ({
      ...task.toObject(),
      dueDate: this.formatDate(task.dueDate),
      createdAt: this.formatDate(task.createdAt),
      updatedAt: this.formatDate(task.updatedAt),
      completedAt: this.formatDate(task.completedAt),
    }));
  }

  async getById(id) {
    const task = await Tasks.findById(id);
    if (!task) return null;
    return {
      ...task.toObject(),
      dueDate: this.formatDate(task.dueDate),
      createdAt: this.formatDate(task.createdAt),
      updatedAt: this.formatDate(task.updatedAt),
      completedAt: this.formatDate(task.completedAt),
    };
  }

  async add(newTask) {
    const task = new Tasks({
      ...newTask,
      dueDate: newTask.dueDate ? formatInTimeZone(new Date(newTask.dueDate), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') : null,
    });
    await task.save();
    return {
      ...task.toObject(),
      dueDate: task.dueDate ? formatInTimeZone(new Date(task.dueDate), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') : null,
      createdAt: formatInTimeZone(new Date(task.createdAt), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz'),
      updatedAt: formatInTimeZone(new Date(task.updatedAt), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz'),
      completedAt: task.completedAt ? formatInTimeZone(new Date(task.completedAt), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') : null,
    };
  }

  async update(taskId, updatedTask) {
    const task = await Tasks.findByIdAndUpdate(taskId, {
      ...updatedTask,
      dueDate: this.formatDate(updatedTask.dueDate),
      updatedAt: new Date(),
      completedAt: updatedTask.completed ? new Date() : null,
    }, { new: true });
    if (!task) return null;
    return {
      ...task.toObject(),
      dueDate: this.formatDate(task.dueDate),
      createdAt: this.formatDate(task.createdAt),
      updatedAt: this.formatDate(task.updatedAt),
      completedAt: this.formatDate(task.completedAt),
    };
  }
}

export default TaskRepository;