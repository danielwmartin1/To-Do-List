// Import required modules
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
// Existing imports from the snippet
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Initialize Express application
const app = express();
const port = 4000;
// const BASE_URL = 'http://localhost:4000/tasks';

// Define __dirname for ES modules
const __dirname = dirname(fileURLToPath(import.meta.url));
const tasksFilePath = join(__dirname, './src/models/tasks.json');

const loadTasks = async () => {
  try {
    // Check if the file exists before reading
    if (!existsSync(tasksFilePath)) {
      throw new Error(`File not found: ${tasksFilePath}`);
    }

    const data = await readFile(tasksFilePath, { encoding: 'utf8' });
    // Try parsing the JSON data
    const tasksData = JSON.parse(data);
    console.log(tasksData);
    return tasksData; // Return the parsed JSON data
  } catch (err) {
    // Handle errors related to file reading or JSON parsing
    console.error('Error occurred:', err.message);
    return null; // Return null in case of error
  }
};


// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(req.method, req.path)
  next()
})

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/Tasks', {});
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};


// In-memory data store
let tasks = []; // Initialize tasks as an empty array

// Assuming loadTasks is an async function
async function initTasks() {
  try {
    tasks = await loadTasks();
    if (!tasks) {
      tasks = []; // Initialize to an empty array if loadTasks returns undefined
    }
  } catch (error) {
    console.error("Error loading tasks:", error);
    tasks = []; // Fallback to an empty array in case of error
  }
}

// Call initTasks at the start, ensuring tasks are loaded before the server starts handling requests
await initTasks();



// Start the server here or ensure it's ready to handle requests
connectDB();

app.get('/tasks', async (req, res) => {
  try {
    res.send(tasks);
    console.log('tasks', tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.get('/tasks/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const task = tasks.find((task) => task.id === id);
    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.send(task);
    console.log('task', task);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const newTask = { 
      id: tasks.length + 1, 
      title: req.body.title,
    };
    tasks.push(newTask);
    res.send(tasks);
    console.log('Posted a task titled', req.body.title);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.delete('/tasks/:id', async (req, res) => { 
  try {
    const id = parseInt(req.params.id);
    tasks = tasks.filter((task) => task.id !== id);
    res.send(tasks);
    console.log('Deleted id' + id);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;