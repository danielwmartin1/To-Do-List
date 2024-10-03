import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import TaskRepository from './repositories/TaskRepository.js';
import fs from 'fs';
import path from 'path';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, _, next) => {
  console.log(req.method, req.path);
  next();
});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadPath = '/tmp/uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://danielwmartin1:Mack2020!!@cluster0.ikgzxfz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {}); // spell-checker: disable-line
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
connectDB();

const taskRepository = new TaskRepository();

app.get('/tasks', async (_req, res) => {
  try {
    const tasks = await taskRepository.getAll();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const task = await taskRepository.add(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const task = await taskRepository.replace(req.params.id, req.body); // Full update
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.patch('/tasks/:id', async (req, res) => {
  try {
    const task = await taskRepository.update(req.params.id, req.body); // Partial update
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await taskRepository.delete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add file upload route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({ filePath: `/tmp/uploads/${req.file.filename}` });
});

// Add route to delete file from task
app.put('/tasks/:id/delete-file', async (req, res) => {
  try {
    const { filePath } = req.body;
    console.log(`Received filePath: ${filePath}`); // Log the received filePath

    const task = await taskRepository.getById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.files = (task.files || []).filter(file => file !== filePath);
    await task.save();

    // Delete the file from the file system
    const fullPath = path.join('/tmp', filePath);
    console.log(`Full path to delete: ${fullPath}`); // Log the full path to delete
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    } else {
      console.log(`File not found: ${fullPath}`); // Log if the file does not exist
    }

    res.json(task);
  } catch (err) {
    console.error(`Error deleting file: ${err.message}`); // Log the error
    res.status(400).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});