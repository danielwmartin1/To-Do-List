import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
    //absent in the frontend
  },
});

const Tasks = mongoose.model('Tasks', TaskSchema);

export default Tasks;
