import express from 'express';
import cors from 'cors';
// Removed unused bodyParser import
import mongoose from 'mongoose';
import TaskRepository from './repositories/TaskRepository.js';
import { formatInTimeZone } from 'date-fns-tz';
import Task from './models/Task.js'; // Ensure you import the Task model

// Initialize Express application
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, _, next) => {
  console.log(req.method, req.path);
  next();
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://<username>:<password>@cluster0.<cluster-id>.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {});
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
connectDB();

// Helper function to format dates
const formatDate = (date) => date ? formatInTimeZone(new Date(date), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') : null;

// Get all tasks
const taskRepository = new TaskRepository();
app.get('/tasks', async (_, res) => {
  try {
    const taskList = await taskRepository.getAll();
    res.send(taskList);
    console.log('taskList', taskList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get a single task
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

// Add a new task
app.post('/tasks', async (req, res) => {
  try {
    const now = new Date();
    // Removed unused formattedDate variable

    const newTask = new Task({
      title: req.body.title,
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
      createdAt: now,
      updatedAt: now,
    });

    const task = await newTask.save();
    res.send(task);
    console.log('Posted a task titled', req.body.title);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Toggle task completion
app.put('/tasks/:id/toggleCompletion', async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).send('Task not found');
    }
    task.completed = !task.completed;
    const now = new Date();
    const formattedDate = formatDate(now);

    task.completedAt = task.completed ? formattedDate : null;
    task.updatedAt = formattedDate;
    await task.save();
    res.send(task); // Return the updated task
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Complete a task
app.patch('/tasks/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const now = new Date();
    const formattedDate = formatDate(now);

    const updateData = {
      ...req.body,
      updatedAt: formattedDate, // Update the updatedAt timestamp
    };

    if (req.body.completed !== undefined) {
      updateData.completedAt = req.body.completed ? formattedDate : null; // Set or clear the completedAt timestamp
    }

    const task = await Task.findByIdAndUpdate(id, updateData, { new: true });
    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.send(task); // Return the updated task
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleteTask = await taskRepository.delete(id);
    res.send(deleteTask);
    console.log('Deleted id' + id);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
