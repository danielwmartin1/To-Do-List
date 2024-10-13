import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatInTimeZone } from 'date-fns-tz';
import '../index.css';

// List component
function List() {
  // State variables
  const [newTask, setNewTask] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedTask, setEditedTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editedDueDate, setEditedDueDate] = useState('');
  const [priority, setPriority] = useState('Low');
  const [editedPriority, setEditedPriority] = useState('Low');
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('updatedAt-desc');
  const [filterStatus, setFilterStatus] = useState('all');
  // Constants 
  const uri = process.env.REACT_APP_BACKEND_URI;
  const clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // Fetch tasks from the server
  const fetchData = async (req) => {
    try {
      const response = await axios.get(`${uri}/tasks`);
      const sortedTaskList = response.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      const formattedTaskList = sortedTaskList.map(task => ({
        ...task,
        updatedAt: formatInTimeZone(new Date(task.updatedAt), clientTimeZone, 'MMMM d, yyyy h:mm a zzz'),
        createdAt: formatInTimeZone(new Date(task.createdAt), clientTimeZone, 'MMMM d, yyyy h:mm a zzz'),
        dueDate: task.dueDate ? formatInTimeZone(new Date(task.dueDate), clientTimeZone, 'MMMM d, yyyy h:mm a zzz') : null,
        completedAt: task.completedAt ? formatInTimeZone(new Date(task.completedAt), clientTimeZone, 'MMMM d, yyyy h:mm a zzz') : null,
        priority: task.priority || 'Low',
      }));
      setTaskList(formattedTaskList);
    } catch (error) {
      setError('Failed to fetch tasks');
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);
  // Add a new task
  const addTask = async () => {
    if (!newTask.trim()) {
      setError('Task title cannot be empty.');
      return;
    }
    if (dueDate && new Date(dueDate) < new Date()) {
      setError('Please choose a future date and time.');
      return;
    }

    const clientIp = await fetchClientIp(); // Fetch client IP
    console.log('Client IP:', clientIp); // Log client IP
    console.log('Client Timezone:', clientTimeZone); // Log client timezone 
    const headers = { 
      'Content-Type': 'application/json',
      'Client-IP': clientIp, // Add client IP to headers
      'Client-Timezone': clientTimeZone // Add client timezone to headers
    };
    console.log('Headers:', headers); // Log headers
    console.log('Request Body:', { title: newTask, dueDate, priority }); // Log request body
    const getGeolocation = async () => {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              resolve({ latitude, longitude });
            },
            (error) => {
              console.error('Error getting geolocation:', error);
              resolve({ latitude: 'Unknown', longitude: 'Unknown' });
            }
          );
        } else {
          console.error('Geolocation is not supported by this browser.');
          resolve({ latitude: 'Unknown', longitude: 'Unknown' });
        }
      });
    };

    const geolocation = await getGeolocation(); // Fetch geolocation
    console.log('Geolocation:', geolocation); // Log geolocation

    try {
      const formattedDueDate = dueDate ? formatInTimeZone(new Date(dueDate), clientTimeZone, 'MMMM d, yyyy h:mm a zzz') : null;
      const response = await axios.post(`${uri}/tasks`, {
        title: newTask,
        dueDate: formattedDueDate,
        priority: priority
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Headers': JSON.stringify(headers), // Add headers
          'Client-IP': clientIp, // Add client IP
          'Client-Timezone': clientTimeZone, // Add client timezone
          'Geolocation': JSON.stringify(geolocation) // Add geolocation
        }
      });
      const formattedTask = {
        ...response.data,
        updatedAt: formatInTimeZone(new Date(response.data.updatedAt), clientTimeZone, 'MMMM d, yyyy h:mm a zzz'),
        createdAt: formatInTimeZone(new Date(response.data.createdAt), clientTimeZone, 'MMMM d, yyyy h:mm a zzz'),
        dueDate: response.data.dueDate ? formatInTimeZone(new Date(response.data.dueDate), clientTimeZone, 'MMMM d, yyyy h:mm a zzz') : null,
        priority: response.data.priority || 'Low',
        completedAt: response.data.completedAt ? formatInTimeZone(new Date(response.data.completedAt), clientTimeZone, 'MMMM d, yyyy h:mm a zzz') : null,
      };
      const updatedTaskList = [formattedTask, ...taskList].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setTaskList(updatedTaskList);
      setNewTask('');
      setDueDate('');
      setPriority('Low');
      setEditedDueDate('');
      setError('');
      setFilterStatus('all');
      
    } catch (error) {
      handleError(error);
    }
  };
  // Handle date change
  const handleDateChange = (event) => {
    const date = new Date(event.target.value);
    const formattedDate = formatInTimeZone(date, clientTimeZone, 'MMMM d, yyyy hh:mm a zzz');
    setEditedDueDate(formattedDate);
  };
// Function to fetch client IP
const fetchClientIp = async () => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error('Failed to fetch client IP:', error);
    return 'Unknown IP';
  }
};

// Update a task
const updateTask = async (taskId) => {
  const clientIp = await fetchClientIp(); // Fetch client IP
  console.log('Client IP:', clientIp); // Log client IP  
  const getGeolocation = async () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (error) => {
            console.error('Error getting geolocation:', error);
            resolve({ latitude: 'Unknown', longitude: 'Unknown' });
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        resolve({ latitude: 'Unknown', longitude: 'Unknown' });
      }
    });
  };

  const geolocation = await getGeolocation(); // Fetch geolocation
  console.log('Geolocation:', geolocation); // Log geolocation
  const headers = { 
    'Content-Type': 'application/json',
    'Client-IP': clientIp, // Add client IP to headers
    'Client-Timezone': clientTimeZone, // Add client timezone to headers
    'Geolocation': JSON.stringify(geolocation) // Add geolocation
  };
  console.log('Headers:', headers); // Log headers
  console.log('Request Body:', { title: editedTask, dueDate: editedDueDate, priority: editedPriority }); // Log request body
  try {
    const editedDueDateUTC = formatInTimeZone(new Date(editedDueDate), clientTimeZone, 'MMMM d, yyyy hh:mm a zzz');
    await axios.patch(`${uri}/tasks/${taskId}`, {
      title: editedTask,
      dueDate: editedDueDateUTC,
      priority: editedPriority,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Client-IP': clientIp, // Add client IP
        'Client-Timezone': clientTimeZone, // Add client timezone
        'Geolocation': JSON.stringify(geolocation) // Add geolocation
      }
    });
    const updatedTaskList = taskList.map((task) => {
      if (task._id === taskId) {
        return {
          ...task,
          title: editedTask,
          dueDate: editedDueDate,
          priority: editedPriority,
          updatedAt: new Date().toISOString()
        };
      }
      return task;
    }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    setTaskList(updatedTaskList);
    setEditingId(null);
  } catch (error) {
    handleError(error);
  }
};
// Remove a task
const removeTask = async (taskId) => {
  const clientIp = await fetchClientIp(); // Fetch client IP
  console.log('Client IP:', clientIp); // Log client IP
  const getGeolocation = async () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (error) => {
            console.error('Error getting geolocation:', error);
            resolve({ latitude: 'Unknown', longitude: 'Unknown' });
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        resolve({ latitude: 'Unknown', longitude: 'Unknown' });
      }
    });
  };

  const geolocation = await getGeolocation(); // Fetch geolocation
  console.log('Geolocation:', geolocation); // Log geolocation
  const headers = { 
    'Content-Type': 'application/json',
    'Client-IP': clientIp, // Add client IP to headers
    'Client-Timezone': clientTimeZone, // Add client timezone to headers
    'Geolocation': JSON.stringify(geolocation) // Add geolocation
  };
  console.log('Headers:', headers); // Log headers
  try {
    await axios.delete(`${uri}/tasks/${taskId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Client-IP': clientIp, // Add client IP
        'Client-Timezone': clientTimeZone, // Add client timezone
        'Geolocation': JSON.stringify(geolocation), // Add geolocation
        'Timezone': clientTimeZone // Add client timezone
      }
    });
    setTaskList(taskList.filter(task => task._id !== taskId));
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};
// Toggle task completion
const toggleTaskCompletion = async (taskId, completed) => {
  const clientIp = await fetchClientIp(); // Fetch client IP
  console.log('Client IP:', clientIp); // Log client IP
  const getGeolocation = async () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (error) => {
            console.error('Error getting geolocation:', error);
            resolve({ latitude: 'Unknown', longitude: 'Unknown' });
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        resolve({ latitude: 'Unknown', longitude: 'Unknown' });
      }
    });
  };

  const geolocation = await getGeolocation(); // Fetch geolocation
  console.log('Geolocation:', geolocation); // Log geolocation
  const headers = { 
    'Content-Type': 'application/json',
    'Client-IP': clientIp, // Add client IP to headers
    'Client-Timezone': clientTimeZone, // Add client timezone to headers
    'Geolocation': JSON.stringify(geolocation), // Add geolocation
    'Timezone': clientTimeZone // Add client timezone
  };
  console.log('Headers:', headers); // Log headers
  console.log('Request Body:', { completed: !completed, completedAt: !completed ? formatInTimeZone(new Date(), clientTimeZone, 'MMMM d, yyyy hh:mm a zzz') : null }); // Log request body
  try {
    const completedAtTimestamp = !completed ? formatInTimeZone(new Date(), clientTimeZone, 'MMMM d, yyyy hh:mm a zzz') : null;
    await axios.put(`${uri}/tasks/${taskId}`, { completed: !completed, completedAt: completedAtTimestamp }, {
      headers: {
        'Content-Type': 'application/json',
        'Client-IP': clientIp, // Add client IP
        'Client-Timezone': clientTimeZone, // Add client timezone
        'Geolocation': JSON.stringify(geolocation), // Add geolocation
        'Timezone': clientTimeZone // Add client timezone
      }
    });
    const updatedTaskList = taskList.map((task) => {
      if (task._id === taskId) {
        return { 
          ...task, 
          completed: !completed, 
          completedAt: completedAtTimestamp,
          updatedAt: formatInTimeZone(new Date(), clientTimeZone, 'MMMM d, yyyy hh:mm a zzz') 
        };
      }
      return task;
    }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    setTaskList(updatedTaskList);
  } catch (error) {
    handleError(error);
  }
};
  // Handle errors
  const handleError = (error) => {
    if (error.message === 'Invalid time value') {
      setError('Pick a Due Date');
    } else if (error.response) {
      setError(`Error: ${error.response.status} - ${error.response.data}`);
    } else if (error.request) {
      setError("Network error: No response received from server");
    } else {
      setError(`Error: ${error.message}`);
    }
  };
  // Get current date and time
  const getCurrentDateTime = () => {
    const now = new Date();
    const formattedTime = formatInTimeZone(now, clientTimeZone, 'MMMM d, yyyy h:mm a zzz');
    return formattedTime;
  };
  // Start editing a task
  const startEditing = (task) => {
    setEditingId(task._id);
    setEditedTask(task.title);
    setEditedDueDate(task.dueDate ? formatInTimeZone(new Date(task.dueDate), clientTimeZone, 'MMMM d, yyyy h:mm a zzz') : '');
    setEditedPriority(task.priority);
  };
  // Handle sort change
  const handleSortChange = (e) => {
    const order = e.target.value;
    setSortOrder(order);
    const sorted = [...taskList].sort((a, b) => {
      const [key, direction] = order.split('-');
      if (key === 'title') {
        return direction === 'asc' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
      } else if (key === 'priority') {
        const priorityOrder = { Low: 1, Medium: 2, High: 3 };
        return direction === 'asc' ? priorityOrder[a[key]] - priorityOrder[b[key]] : priorityOrder[b[key]] - priorityOrder[a[key]];
      } else {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
    });
    setTaskList(sorted);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  // Filter tasks
  const filteredTasks = taskList.filter(task => {
    if (filterStatus === 'completed') {
      return task.completed;
    } else if (filterStatus === 'incomplete') {
      return !task.completed;
    } else {
      return true;
    }
  });

  // Sort tasks
  const incompleteTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);
  // Return JSX
  return (
    <React.StrictMode>
      <div id='container'>
        {error && <div className="error">{error}</div>}
        <div className="inputContainer">
          <input
            autoFocus
            className="newTask"
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add a new task"
          />
          <input
            className="newTask"
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
          />
          <select 
            className="newTask"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            placeholder="Priority"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button className='addButton' onClick={addTask}>Add Task</button>
        </div>

        <div className="sortSection">
          <label className="label" htmlFor="sortTasks">Sort by: </label>
          <select id="sortTasks" value={sortOrder} onChange={handleSortChange}>
            <option className="sortOption" value="createdAt-asc">Created Date Ascending</option>
            <option className="sortOption" value="createdAt-desc">Created Date Descending</option>
            <option className="sortOption" value="completedAt-asc">Completed Date Ascending</option>
            <option className="sortOption" value="completedAt-desc">Completed Date Descending</option>
            <option className="sortOption" value="dueDate-asc">Due Date Ascending</option>
            <option className="sortOption" value="dueDate-desc">Due Date Descending</option>
            <option className="sortOption" value="priority-asc">Priority Ascending</option>
            <option className="sortOption" value="priority-desc">Priority Descending</option>
            <option className="sortOption" value="title-asc">Title Ascending</option>
            <option className="sortOption" value="title-desc">Title Descending</option>
            <option className="sortOption" value="updatedAt-asc">Updated Date Ascending</option>
            <option className="sortOption" value="updatedAt-desc">Updated Date Descending</option>
          </select>
          <label className="label" htmlFor="filterTasks">Filter by: </label>
          <select id="filterTasks" value={filterStatus} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>

        {taskList.length > 0 ? (
          <div className="todo-container">
            <div className="incompleteTaskList" onClick={() => setEditingId(null)}>
              <h2 onClick={() => handleFilterChange({ target: { value: 'incomplete' } })}>Incomplete Tasks</h2>
              <ul className="taskList" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.key === "Escape" && setEditingId(null)}>
                {incompleteTasks.map((task) => {
                  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
                  return (
                    <li
                      className={`listItem ${task.completed ? 'completedTask' : ''} ${isOverdue && !task.completed ? 'overdueIncompleteTask' : ''}`}
                      key={task._id}
                    >
                      <input
                        className="checkbox"
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskCompletion(task._id, task.completed)}
                        onClick={(e) => { e.stopPropagation(); }}
                      />
                      {editingId === task._id && !task.completed ? (
                        <div className="editDiv">
                          <div className="editContainer">
                            <label className="editLabel">Edit Task:</label>
                            <input
                              className='editTask'
                              autoFocus
                              type="text"
                              value={editedTask}
                              onChange={(e) => setEditedTask(e.target.value)}
                            />
                          </div>
                          <div className="editContainer">
                            <label className="editLabel">Edit Due Date:</label>
                            <input
                              className='editTask'
                              type="datetime-local"
                              value={editedDueDate ? new Date(editedDueDate).toISOString().slice(0, 16) : ''}
                              onChange={handleDateChange}
                              min={new Date().toISOString().split('.')[0]}
                            />
                          </div>
                          <div className="editContainer">
                            <label className="editLabel">Edit Priority:</label>
                            <select 
                              className="editTask"
                              value={editedPriority}
                              onChange={(e) => setEditedPriority(e.target.value)}
                            >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          </div>
                          <button
                            className="saveButton"
                            onClick={() => updateTask(task._id)}
                          >Save</button>
                        </div>
                      ) : (
                        <div className={`taskItem ${isOverdue ? 'overdueTaskItem' : ''} ${editingId === task._id ? 'editing' : ''}`}>
                          <div className="titleDiv"><span className="taskTitle">{task.title}</span></div>
                          <div className="timestampContainer">
                            {task.dueDate && <span className={`timestamp ${isOverdue ? 'overdue' : ''}`}>Due: {task.dueDate}</span>}
                            <span className="timestamp">Created: {task.createdAt}</span>
                            <span className="timestamp">Updated: {task.updatedAt}</span>
                            <span className="timestamp">Priority: {task.priority}</span> 
                            {task.completed && <span className="timestamp completedTimestamp">Completed: {task.completedAt}</span>}
                          </div>
                        </div>
                      )}
                      <div className="taskActions">
                        {editingId !== task._id && (
                          <>
                            <button
                              className="editButton"
                              onClick={(e) => { e.stopPropagation(); startEditing(task); }}
                              aria-label={`Edit task "${task.title}"`}
                            >Edit</button>
                            <button
                              className="removeButton"
                              onClick={(e) => { e.stopPropagation(); removeTask(task._id); }}
                              aria-label={`Remove task "${task.title}"`}
                            >Remove</button>
                          </>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="completedTaskList" onClick={() => setEditingId(null)}>
              <h2 onClick={() => handleFilterChange({ target: { value: 'completed' } })}>Completed Tasks</h2>
              <ul className="taskList" onClick={(e) => e.stopPropagation()}>
                {completedTasks.map((task) => {
                  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
                  return (
                    <li
                      className={`listItem ${task.completed ? 'completedTask' : ''} ${isOverdue && !task.completed ? 'overdueIncompleteTask' : ''}`}
                      key={task._id}
                    >
                      <input
                        className="checkbox"
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskCompletion(task._id, task.completed)}
                        onClick={(e) => { e.stopPropagation(); }}
                      />
                      {editingId === task._id && !task.completed ? (
                        <div className="editDiv">
                          <div className="editContainer">
                            <label className="editLabel">Edit Task:</label>
                            <input
                              className='editTask'
                              autoFocus
                              type="text"
                              value={editedTask}
                              onChange={(e) => setEditedTask(e.target.value)}
                            />
                          </div>
                          <div className="editContainer">
                            <label className="editLabel">Edit Due Date:</label>
                            <input
                              className='editTask'
                              type="datetime-local"
                              value={editedDueDate}
                              onChange={(e) => setEditedDueDate(e.target.value)}
                              min={getCurrentDateTime()}
                            />
                          </div>
                          <div className="editContainer">
                            <label className="editLabel">Edit Priority:</label>
                            <select 
                              className="editTask"
                              value={editedPriority}
                              onChange={(e) => setEditedPriority(e.target.value)}
                            >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          </div>
                          <button
                            className="saveButton"
                            onClick={() => updateTask(task._id)}
                          >Save</button>
                        </div>
                      ) : (
                        <div className={`taskItem ${isOverdue ? 'overdueTaskItem' : ''} ${editingId === task._id ? 'editing' : ''}`}>
                          <div className="titleDiv"><span className="taskTitle">{task.title}</span></div>
                          <div className="timestampContainer">
                            {task.dueDate && <span className={`timestamp ${isOverdue ? 'overdue' : ''}`}>Due: {task.dueDate}</span>}
                            <span className="timestamp">Created: {task.createdAt}</span>
                            <span className="timestamp">Updated: {task.updatedAt}</span>
                            <span className="timestamp">Priority: {task.priority}</span>
                            {task.completed && <span className="timestamp">Completed: {task.completedAt}</span>}
                          </div>
                        </div>
                      )}
                      <div className="taskActions">
                        {editingId !== task._id && (
                          <>
                            <button
                              className="removeButton"
                              onClick={(e) => { e.stopPropagation(); removeTask(task._id); }}
                              aria-label={`Remove task "${task.title}"`}
                            >Remove</button>
                          </>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ) : (
          <div className="noTasksMessage">No tasks available</div>
        )}
      </div>
    </React.StrictMode>
  );
}

export default List;
