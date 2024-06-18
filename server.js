import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
//import TaskSchema from './models/Tasks.js';
//import tasks from './models/tasks.json';
//import TaskRepository from './repositories/TaskRepository.js';
//const taskRepository = new TaskRepository();
//import TaskService from './services/TaskService.js';
//import TaskRoutes from './routes/TaskRoutes';
//import axios from 'axios';
import connectDB from './src/config/database.js';


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
app.use(bodyParser.json(tasks));
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(req.method, req.path)
  next()
})
// Connect to MongoDB
connectDB();

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
    id: tasks.length + 1, 
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
      console.log('Edited to', updatedTaskData); // Move logging inside the condition
      return { ...task, ...updatedTaskData }; // Correctly merge updated data with the existing task
    }
    return task; // Return the task as is if the id doesn't match
  });
  res.send(tasks); // Send back the updated tasks array as a response
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