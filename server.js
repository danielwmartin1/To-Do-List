const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const Tasks = require('./models/tasks');

const app = express();
const port = 4000;
// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(req.method, req.path)
  next()
})

// Connect to MongoDB
const mongo_uri = 'mongodb://localhost:27017';
const mongodb = async () => {
  try {
    await mongoose.connect(mongo_uri, []);
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

let nextId = 4;

app.get('/tasks', (req, res) => {
  res.send(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((task) => task.id === id);
  res.send(task);
});

app.post('/tasks', (req, res) => {
  const newTask = {
    id: nextId++, 
    title: req.body.title,
  };
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
