import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
//import TaskSchema from './models/Tasks.js';
//import tasks from './models/tasks.json';
//import TaskRepository from './repositories/TaskRepository';
//const taskRepository = new TaskRepository();
//import TaskService from './services/TaskService';
//import TaskRoutes from './routes/TaskRoutes';
//const taskRoutes = new TaskRoutes();
//import axios from 'axios';
//import connectDB from './config/database';


const app = express();
const port = 4000;

let tasks = [
  {
    id: 1,
    title: "The Rise of Decentralized Finance"
  },
  {
    id: 2,
    title: "The Impact of Artificial Intelligence on Modern Businesses"
  },
  {
    id : 3,
    title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle"
  }
]
// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(req.method, req.path)
  next()
})

// Connect to MongoDB
const BASE_URL = 'mongodb://localhost:27017/tasks';
const mongodb = async () => {
  try {
    await mongoose.connect(BASE_URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};
mongodb();

// In-memory data store


app.get('/tasks', async (req, res) => {
  res.send(tasks);
  console.log('tasks', tasks);
});

app.get('/tasks/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((task) => task.id === id);
  res.send(task);
  console.log('task', task);
});

app.post('/tasks', async (req, res) => {
  const newTask = { 
    title: req.body.title,
  };
  tasks.push(newTask);
  res.send(tasks);
  console.log('Posted a task titled', req.body.title);
});

app.put('/tasks/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const updatedTaskData = req.body;
  tasks = tasks.map((task) => {
    if (task.id === id) {
      task = {
        ...task,
        ...updatedTaskData
      };
    }
    console.log('Edited to', updatedTaskData);
    return updatedTaskData;
  });
  const updatedTask = tasks.find((task) => task.id === id);
  res.send(updatedTask);
});

app.delete('/tasks/:id', async (req, res) => { 
  const id = parseInt(req.params.id);
  tasks = tasks.filter((task) => task.id !== id);
  res.send(tasks);
  console.log('Deleted id' + id);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export default app;