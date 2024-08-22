// Import required modules
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import TaskRepository from './repositories/TaskRepository.js';

// Initialize Express application
const app = express();
const port = process.env.PORT || 4000;

// middleware
// CORS configuration
const corsOptions = {
  origin: '*', // Allow requests from all origins
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

// middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(req.method, req.path)
  next();
})

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://danielwmartin1:Mack2020!!@cluster0.ikgzxfz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {});
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
// Start the server here or ensure it's ready to handle requests
connectDB();
// Get all tasks
const taskRepository = new TaskRepository();
app.get('/', async (req, res) => {
  res.send("hello world");
});
app.get('/tasks', async (req, res) => {
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
    //const id = parseInt(req.params.id);
    const id = req.params.id;
    const task = await taskRepository.getById(id);
    
    if (!task) {
      return res.status(404).send('Task not found');
    }
    console.log('task', task);
    res.send(task);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});
// Add a new task
app.post('/tasks', async (req, res) => {
  try {
    const newTask = {  
      title: req.body.title,
    };
    const task = await taskRepository.add(newTask);
    res.send(task);
    console.log('Posted a task titled', req.body.title);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});
//  Update a task
app.put('/tasks/:id', async (req, res) => {
  try {
    //const id = parseInt(req.params.id);
    const id = req.params.id;
    const updatedTaskData = req.body;
    const task = await taskRepository.update(id, updatedTaskData);
    res.send(task); // Send back the updated tasks array as a response
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});
// Completed a task
app.patch('/tasks/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const completedTaskData = req.body;
    const completedTask = await taskRepository.completed(id, completedTaskData);
    res.send(completedTask); // Send back the updated tasks array as a response
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});
// Delete a task
app.delete('/tasks/:id', async (req, res) => { 
  try {
    //const id = parseInt(req.params.id);
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

