import mongoose from 'mongoose';
import { formatInTimeZone } from 'date-fns-tz';

const clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Define the Task schema
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  createdAt: { type: String, default: () => formatInTimeZone(new Date(), clientTimezone, 'MMMM dd, yyyy hh:mm:ss a zzz') },
  dueDate: { type: String, set: (date) => isValidDate(date) ? formatInTimeZone(new Date(date), clientTimezone, 'MMMM dd, yyyy hh:mm:ss a zzz') : date },
  completed: { type: Boolean, default: false },
  completedAt: { type: String, set: (date) => date && isValidDate(date) ? formatInTimeZone(new Date(date), clientTimezone, 'MMMM dd, yyyy hh:mm:ss a zzz') : date },
  updatedAt: { type: String, default: () => formatInTimeZone(new Date(), clientTimezone, 'MMMM dd, yyyy hh:mm:ss a zzz') },
});

// Middleware to update the updatedAt field
TaskSchema.pre('save', function(next) {
  this.updatedAt = formatInTimeZone(new Date(), clientTimezone, 'MMMM dd, yyyy hh:mm:ss a zzz');
  next();
});

TaskSchema.pre('findOneAndUpdate', function(next) {
  this._update.updatedAt = formatInTimeZone(new Date(), clientTimezone, 'MMMM dd, yyyy hh:mm:ss a zzz');
  next();
});

// Add a toJSON method to format dates before sending to frontend
TaskSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.createdAt = formatInTimeZone(new Date(obj.createdAt), clientTimezone, 'MMMM dd, yyyy hh:mm:ss a zzz');
  obj.dueDate = obj.dueDate ? formatInTimeZone(new Date(obj.dueDate), clientTimezone, 'MMMM dd, yyyy hh:mm:ss a zzz') : null;
  obj.completedAt = obj.completedAt ? formatInTimeZone(new Date(obj.completedAt), clientTimezone, 'MMMM dd, yyyy hh:mm:ss a zzz') : null;
  obj.updatedAt = formatInTimeZone(new Date(obj.updatedAt), clientTimezone, 'MMMM dd, yyyy hh:mm:ss a zzz');
  return obj;
};

// Helper function to check if a date is valid
function isValidDate(date) {
  return !isNaN(Date.parse(date));
}

// Create a model
const Tasks = mongoose.model('Tasks', TaskSchema);

export default Tasks;