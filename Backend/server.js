import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import TaskRepository from './repositories/TaskRepository.js';
import Tasks from './models/Tasks.js';
import { formatInTimeZone } from 'date-fns-tz';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, _, next) => {
  console.log(req.method, req.path);
  next();
});

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://<username>:<password>@cluster0.ikgzxfz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {});
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
connectDB();

const taskRepository = new TaskRepository();

app.get('/tasks', async (req, res) => {
  try {
    const taskList = await taskRepository.getAll();
    res.send(taskList);
    console.log('taskList', taskList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.get('/tasks/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const task = await taskRepository.getById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.send(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const now = new Date();
    const newTask = new Tasks({
      title: req.body.title,
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
      createdAt: now,
      updatedAt: now,
      priority: req.body.priority || 'low' // Handle priority
    });

    const task = await newTask.save();
    res.send(task);
    console.log('Posted a task titled', req.body.title);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.put('/tasks/:id/toggleCompletion', async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Tasks.findById(taskId);
    if (!task) {
      return res.status(404).send('Task not found');
    }
    task.completed = !task.completed;
    const now = new Date();
    task.completedAt = task.completed ? now : null;
    task.updatedAt = now;
    task.priority = task.priority || 'low'; // Handle priority
    await task.save();
    res.send(task);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.patch('/tasks/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const now = new Date();
    const updateData = {
      ...req.body,
      updatedAt: now,
    };

    if (typeof req.body.completed === 'boolean') {
      updateData.completedAt = req.body.completed ? now : null;
    }

    const task = await Tasks.findByIdAndUpdate(id, updateData, { new: true });
    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.send(task);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleteTask = await taskRepository.delete(id);
    res.send(deleteTask);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;