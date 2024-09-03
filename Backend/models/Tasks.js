import mongoose from 'mongoose';

// Create a schema
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true }); // Add timestamps option

// Create a model
const Tasks = mongoose.model('Tasks', TaskSchema);

export default Tasks;