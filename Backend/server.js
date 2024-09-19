import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
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
    const tasks = await taskRepository.getAllTasks();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const task = await taskRepository.createTask(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const task = await taskRepository.updateTask(req.params.id, req.body);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await taskRepository.deleteTask(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});