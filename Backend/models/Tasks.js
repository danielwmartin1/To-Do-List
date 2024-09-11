import mongoose from 'mongoose';
import { formatInTimeZone } from 'date-fns-tz';

// Function to get the current date in a specific timezone
const getFormattedDate = (date) => {
  const timeZone = 'America/New_York'; // Specify your desired timezone
  return formatInTimeZone(date, timeZone, 'MM:dd:yyyy hh:mm a \'EST\'');
};

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
  createdAt: {
    type: String,
    default: () => getFormattedDate(new Date()),
  },
  updatedAt: {
    type: String,
    default: () => getFormattedDate(new Date()),
  },
  dueDate: {
    type: String, // Change to String to store formatted string
    required: false,
    default: () => getFormattedDate(new Date()),
  },
  completedAt: {
    type: String, // Change to String to store formatted string
    default: () => getFormattedDate(new Date()),
  },
}, { timestamps: true }); // Add timestamps option

// Pre-save hook to format dueDate, createdAt, and updatedAt as formatted strings
TaskSchema.pre('save', function (next) {
  if (this.dueDate) {
    this.dueDate = getFormattedDate(new Date(this.dueDate));
  }
  this.createdAt = getFormattedDate(new Date(this.createdAt));
  this.updatedAt = getFormattedDate(new Date());
  if (this.completed && !this.completedAt) {
    this.completedAt = getFormattedDate(new Date());
  }
  next();
});

// Add a toJSON method to format dates before sending to frontend
TaskSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.createdAt = getFormattedDate(new Date(obj.createdAt));
  obj.updatedAt = getFormattedDate(new Date(obj.updatedAt));
  if (obj.dueDate) {
    obj.dueDate = getFormattedDate(new Date(obj.dueDate));
  }
  if (obj.completedAt) {
    obj.completedAt = getFormattedDate(new Date(obj.completedAt));
  }
  return obj;
};

// Create a model
const Tasks = mongoose.model('Tasks', TaskSchema);

export default Tasks;