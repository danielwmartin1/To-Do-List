// routes/taskRoutes.js
import express from 'express';
//import TaskService from '../services/TaskService.js';
import axios from 'axios';

const app = express();
const BASE_URL = 'http://localhost:4000/tasks';

// Task routes
app.get('/tasks', async (req, res) => {
  try {
    const response = await axios.get(BASE_URL);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/tasks/:id', async (req, res) => {
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

app.post('/tasks', async (req, res) => {
  try {
    const response = await axios.post(BASE_URL, req.body);
    res.status(201).json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    await axios.put(`${BASE_URL}/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (err) {
    if (err.response.status === 404) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    await axios.delete(`${BASE_URL}/${req.params.id}`);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    if (err.response.status === 404) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

export default app;
