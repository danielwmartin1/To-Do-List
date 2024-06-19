import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
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

console.log("hello world");
const connectDB = async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/Tasks', {});
      console.log('MongoDB connected...');
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  };
await connectDB();


await addNewTask();
//await removeTask();
await updateTask();

async function addNewTask() {
  let task = new Tasks({
    id: 1,
    title: 'Task 1',
    completed: false,
  });
  await task.save();
  console.log('Task created successfully');
  console.log('Task:', task);
}
async function removeTask() {
  await Tasks.deleteOne({ id: 1 });
  console.log("Task removed successfully");
}
async function updateTask() {
  let task = await Tasks.findOne({ id: 1 });
  task.completed = true;
  await task.save();
  console.log('Task updated successfully');
  console.log('Task:', task);
}
