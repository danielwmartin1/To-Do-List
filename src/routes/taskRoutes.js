// routes/taskRoutes.js
import express from 'express';
import TaskService from '../services/TaskService';
import axios from 'axios';

const taskService = new TaskService();
const app = express();
const BASE_URL = 'http://localhost:4000/api/tasks';

// Task routes
app.get('/api/tasks', async (req, res) => {
  try {
    const response = await axios.get(BASE_URL);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tasks/:id', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    if (err.response.status === 404) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const response = await axios.post(BASE_URL, req.body);
    res.status(201).json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const response = await axios.put(`${BASE_URL}/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (err) {
    if (err.response.status === 404) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${req.params.id}`);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    if (err.response.status === 404) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

module.exports = app;
