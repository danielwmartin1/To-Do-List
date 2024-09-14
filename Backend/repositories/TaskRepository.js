// repositories/TaskRepository.js
import Tasks from '../models/Tasks.js';
import { formatInTimeZone } from 'date-fns-tz';

class TaskRepository {
  async getAll() {
    const tasks = await Tasks.find();
    return tasks.map(task => ({
      ...task.toObject(),
      dueDate: task.dueDate ? formatInTimeZone(new Date(task.dueDate), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') : null,
      createdAt: formatInTimeZone(new Date(task.createdAt), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz'),
      updatedAt: formatInTimeZone(new Date(task.updatedAt), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz'),
      completedAt: task.completedAt ? formatInTimeZone(new Date(task.completedAt), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') : null,
    }));
  }

  async getById(id) {
    const task = await Tasks.findById(id);
    if (!task) return null;
    return {
      ...task.toObject(),
      dueDate: task.dueDate ? formatInTimeZone(new Date(task.dueDate), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') : null,
      createdAt: formatInTimeZone(new Date(task.createdAt), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz'),
      updatedAt: formatInTimeZone(new Date(task.updatedAt), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz'),
      completedAt: task.completedAt ? formatInTimeZone(new Date(task.completedAt), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') : null,
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
      dueDate: updatedTask.dueDate ? formatInTimeZone(new Date(updatedTask.dueDate), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') : null,
      updatedAt: formatInTimeZone(new Date(), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz'),
    }, { new: true });
    if (!task) return null;
    return {
      ...task.toObject(),
      dueDate: task.dueDate ? formatInTimeZone(new Date(task.dueDate), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') : null,
      createdAt: formatInTimeZone(new Date(task.createdAt), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz'),
      updatedAt: formatInTimeZone(new Date(task.updatedAt), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz'),
      completedAt: task.completedAt ? formatInTimeZone(new Date(task.completedAt), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') : null,
    };
  }
}

export default TaskRepository;