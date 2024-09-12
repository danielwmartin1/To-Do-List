import mongoose from 'mongoose';
import { formatInTimeZone } from 'date-fns-tz';

// Utility function to format dates in EST
const getFormattedDate = (date) => {
  const timeZone = 'America/New_York';
  return formatInTimeZone(date, timeZone, 'PPpp');
};

// Define the Task schema
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dueDate: { type: String, set: (date) => getFormattedDate(date instanceof Date ? date : new Date(date)) },
  completed: { type: Boolean, default: false },
  completedAt: { type: String, set: (date) => getFormattedDate(date instanceof Date ? date : new Date(date)) },
  updatedAt: { type: String, default: getFormattedDate(new Date()) },
}, { timestamps: true });

// Add a toJSON method to format dates before sending to frontend
TaskSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.createdAt = getFormattedDate(obj.createdAt);
  obj.updatedAt = getFormattedDate(obj.updatedAt);
  if (obj.dueDate) {
    obj.dueDate = getFormattedDate(obj.dueDate);
  }
  if (obj.completedAt) {
    obj.completedAt = getFormattedDate(obj.completedAt);
  }
  return obj;
};

// Create a model
const Tasks = mongoose.model('Tasks', TaskSchema);

export default Tasks;