import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import multer from 'multer'; // Import Multer
import TaskRepository from './repositories/TaskRepository.js';
import { formatInTimeZone, format, utcToZonedTime } from 'date-fns-tz';
import Task from './models/Tasks.js'; // Ensure you import the Task model

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
    await mongoose.connect('mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority&appName=Cluster0', {});
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
connectDB();

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the directory to save the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Specify the filename format
  }
});

// Create a Multer instance with the storage configuration
const upload = multer({ storage: storage });

// Get all tasks
const taskRepository = new TaskRepository();
app.get('/tasks', async (_, res) => {
  try {
    const taskList = await taskRepository.getAll();
    res.send(taskList);
    console.log('taskList', taskList);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Get a single task
app.get('/tasks/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const task = await taskRepository.getById(id);
    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.send(task);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Add a new task
app.post('/tasks', upload.single('attachment'), async (req, res) => {
  try {
    const now = new Date();
    const timeZone = 'America/New_York';
    const zonedDate = utcToZonedTime(now, timeZone);
    const formattedDate = format(zonedDate, 'MMMM dd, yyyy hh:mm:ss a zzz', { timeZone });

    const newTask = {
      title: req.body.title,
      dueDate: req.body.dueDate ? format(utcToZonedTime(new Date(req.body.dueDate), timeZone), 'MMMM dd, yyyy hh:mm:ss a zzz', { timeZone }) : null,
      createdAt: formattedDate,
      updatedAt: formattedDate,
      attachment: req.file ? req.file.path : null // Save the file path if a file is uploaded
    };
    const task = await taskRepository.add(newTask);
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
    const timeZone = 'America/New_York';
    const zonedDate = utcToZonedTime(now, timeZone);
    const formattedDate = format(zonedDate, 'MMMM dd, yyyy hh:mm:ss a zzz', { timeZone });

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
    const completedTaskData = {
      ...req.body,
      completed: true,
      completedAt: format(utcToZonedTime(new Date(), 'America/New_York'), 'MMMM dd, yyyy hh:mm:ss a zzz', { timeZone: 'America/New_York' }), // Set the completedAt timestamp
      updatedAt: format(utcToZonedTime(new Date(), 'America/New_York'), 'MMMM dd, yyyy hh:mm:ss a zzz', { timeZone: 'America/New_York' }),
    };
    const task = await Task.findByIdAndUpdate(id, completedTaskData, { new: true });
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