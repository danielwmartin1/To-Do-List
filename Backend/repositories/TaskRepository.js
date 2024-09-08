import { formatInTimeZone } from 'date-fns-tz';
import Tasks from '../models/Tasks.js';

class TaskRepository {
  async getAll() {
    const tasks = await Tasks.find();
    return tasks.map(task => ({
      ...task.toObject(),
      dueDate: task.dueDate ? formatInTimeZone(new Date(task.dueDate), 'America/New_York', 'PPpp') : null,
      createdAt: formatInTimeZone(new Date(task.createdAt), 'America/New_York', 'PPpp'),
      updatedAt: formatInTimeZone(new Date(task.updatedAt), 'America/New_York', 'PPpp'),
    }));
  }

  async getById(id) {
    const task = await Tasks.findById(id);
    if (!task) return null;
    return {
      ...task.toObject(),
      dueDate: task.dueDate ? formatInTimeZone(new Date(task.dueDate), 'America/New_York', 'PPpp') : null,
      createdAt: formatInTimeZone(new Date(task.createdAt), 'America/New_York', 'PPpp'),
      updatedAt: formatInTimeZone(new Date(task.updatedAt), 'America/New_York', 'PPpp'),
    };
  }

  async add(newTask) {
    const task = new Tasks(newTask);
    await task.save();
    return {
      ...task.toObject(),
      dueDate: task.dueDate ? formatInTimeZone(new Date(task.dueDate), 'America/New_York', 'PPpp') : null,
      createdAt: formatInTimeZone(new Date(task.createdAt), 'America/New_York', 'PPpp'),
      updatedAt: formatInTimeZone(new Date(task.updatedAt), 'America/New_York', 'PPpp'),
    };
  }

  async update(id, updatedTaskData) {
    const task = await Tasks.findByIdAndUpdate(id, updatedTaskData, { new: true });
    if (!task) return null;
    return {
      ...task.toObject(),
      dueDate: task.dueDate ? formatInTimeZone(new Date(task.dueDate), 'America/New_York', 'PPpp') : null,
      createdAt: formatInTimeZone(new Date(task.createdAt), 'America/New_York', 'PPpp'),
      updatedAt: formatInTimeZone(new Date(task.updatedAt), 'America/New_York', 'PPpp'),
    };
  }

  async completed(id, completedTaskData) {
    const task = await Tasks.findByIdAndUpdate(id, completedTaskData, { new: true });
    if (!task) return null;
    return {
      ...task.toObject(),
      dueDate: task.dueDate ? formatInTimeZone(new Date(task.dueDate), 'America/New_York', 'PPpp') : null,
      createdAt: formatInTimeZone(new Date(task.createdAt), 'America/New_York', 'PPpp'),
      updatedAt: formatInTimeZone(new Date(task.updatedAt), 'America/New_York', 'PPpp'),
    };
  }

  async delete(id) {
    const task = await Tasks.findByIdAndDelete(id);
    if (!task) return null;
    return {
      ...task.toObject(),
      dueDate: task.dueDate ? formatInTimeZone(new Date(task.dueDate), 'America/New_York', 'PPpp') : null,
      createdAt: formatInTimeZone(new Date(task.createdAt), 'America/New_York', 'PPpp'),
      updatedAt: formatInTimeZone(new Date(task.updatedAt), 'America/New_York', 'PPpp'),
    };
  }
}

export default TaskRepository;