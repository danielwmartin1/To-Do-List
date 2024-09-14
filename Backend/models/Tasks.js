import mongoose from 'mongoose';
import { formatInTimeZone } from 'date-fns-tz';

// Define the Task schema
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  createdAt: { type: String, default: () => formatInTimeZone(new Date(), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') },
  dueDate: { type: String, set: (date) => formatInTimeZone(new Date(date), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') },
  completed: { type: Boolean, default: false },
  completedAt: { type: String, set: (date) => date ? formatInTimeZone(new Date(date), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') : null },
  updatedAt: { type: String, default: () => formatInTimeZone(new Date(), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') },
});

// Middleware to update the updatedAt field
TaskSchema.pre('save', function(next) {
  this.updatedAt = formatInTimeZone(new Date(), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz');
  next();
});

TaskSchema.pre('findOneAndUpdate', function(next) {
  this._update.updatedAt = formatInTimeZone(new Date(), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz');
  next();
});

// Add a toJSON method to format dates before sending to frontend
TaskSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.dueDate = obj.dueDate ? formatInTimeZone(new Date(this.dueDate), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') : null;
  obj.completedAt = obj.completedAt ? formatInTimeZone(new Date(this.completedAt), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') : null;
  obj.updatedAt = obj.updatedAt ? formatInTimeZone(new Date(this.updatedAt), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') : null;
  return obj;
};

// Create a model
const Tasks = mongoose.model('Tasks', TaskSchema);

export default Tasks;