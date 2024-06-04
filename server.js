const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/tasks', {});

// Connect to MongoDB
const mongodb = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/tasks', []);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};
mongodb();


// In-memory data store
let tasks = [
  {
    id: 1,
    title: "The Rise of Decentralized Finance",
  },
  {
    id: 2,
    title: "The Impact of Artificial Intelligence on Modern Businesses",
  },
  {
    id: 3,
    title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
  },
];

app.get('/tasks', (req, res) => {
  res.send(tasks);
});

app.post('/tasks', (req, res) => {
  const newTask = req.body;
  tasks.push(newTask);
  res.send(tasks);
});

app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedTask = req.body;
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return updatedTask;
    }
    return task;
  });
  res.send(tasks);
});

app.delete('/tasks/:id', (req, res) => { 
  const id = parseInt(req.params.id);
  tasks = tasks.filter((task) => task.id !== id);
  res.send(tasks);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
