import mongoose from 'mongoose';
import formatInTimeZone from '../../Frontend/src/dateUtils.js';
import { formatInTimeZone } from 'date-fns-tz';

// Define the Task schema
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dueDate: { type: String, set: (date) => formatInTimeZone(date instanceof Date ? date : new Date(date), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') },
  completed: { type: Boolean, default: false },
  completedAt: { type: String, set: (date) => date ? formatInTimeZone(date instanceof Date ? date : new Date(date), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') : null },
  updatedAt: { type: String, default: formatInTimeZone(new Date(), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') },
}, { timestamps: true });

// Add a toJSON method to format dates before sending to frontend
TaskSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.createdAt = formatInTimeZone((this.createdAt), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz');
  obj.updatedAt = formatInTimeZone((this.updatedAt), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz');
  if (obj.dueDate) {
    obj.dueDate = formatInTimeZone((this.dueDate), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz');
  }
  if (obj.completed) {
    obj.completedAt = formatInTimeZone((this.completedAt)), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz';
  }
  return obj;
};

// Create a model
const Tasks = mongoose.model('Tasks', TaskSchema);

export default Tasks;