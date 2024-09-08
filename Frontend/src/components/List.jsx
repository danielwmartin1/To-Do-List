import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatInTimeZone } from 'date-fns-tz';
import '../index.css';

function List() {
  const [newTask, setNewTask] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedTask, setEditedTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editedDueDate, setEditedDueDate] = useState('');
  const [error, setError] = useState('');
  const uri = 'https://todolist-backend-six-woad.vercel.app';

  const fetchData = async () => {
    try {
      const response = await axios.get(`${uri}/tasks`);
      const sortedTaskList = response.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      const formattedTaskList = sortedTaskList.map(task => ({
        ...task,
        updatedAt: formatInTimeZone(new Date(task.updatedAt), 'America/New_York', 'PPpp'),
        createdAt: formatInTimeZone(new Date(task.createdAt), 'America/New_York', 'PPpp'),
        dueDate: task.dueDate ? formatInTimeZone(new Date(task.dueDate), 'America/New_York', 'PPpp') : null,
      }));
      setTaskList(formattedTaskList);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) {
      alert('Please enter a task.');
      return;
    }
    if (new Date(dueDate) < new Date()) {
      alert('Please choose a future date and time.');
      return;
    }
    try {
      const response = await axios.post(`${uri}/tasks`, { title: newTask, dueDate });
      const formattedTask = {
        ...response.data,
        updatedAt: formatInTimeZone(new Date(response.data.updatedAt), 'America/New_York', 'PPpp'),
        createdAt: formatInTimeZone(new Date(response.data.createdAt), 'America/New_York', 'PPpp'),
        dueDate: response.data.dueDate ? formatInTimeZone(new Date(response.data.dueDate), 'America/New_York', 'PPpp') : null,
      };
      const updatedTaskList = [formattedTask, ...taskList].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setTaskList(updatedTaskList);
      setNewTask('');
      setDueDate('');
    } catch (error) {
      handleError(error);
    }
  };

  const updateTask = async (taskId) => {
    try {
      if (new Date(editedDueDate) < new Date()) {
        alert('Please choose a future date and time.');
        return;
      }
      // eslint-disable-next-line
      const response = await axios.put(`${uri}/tasks/${taskId}`, { title: editedTask, dueDate: editedDueDate });
      const updatedTaskList = taskList.map((task) => {
        if (task._id === taskId) {
          return { 
            ...task, 
            title: editedTask, 
            dueDate: editedDueDate ? formatInTimeZone(new Date(editedDueDate), 'America/New_York', 'PPpp') : null, 
            updatedAt: formatInTimeZone(new Date(), 'America/New_York', 'PPpp') 
          };
        }
        return task;
      }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setTaskList(updatedTaskList);
      setEditingId(null);
      setEditedTask('');
      setEditedDueDate('');
    } catch (error) {
      handleError(error);
    }
  };

  const removeTask = async (taskId) => {
    try {
      await axios.delete(`${uri}/tasks/${taskId}`);
      const updatedTaskList = taskList.filter((task) => task._id !== taskId);
      setTaskList(updatedTaskList);
    } catch (error) {
      handleError(error);
    }
  };

  const toggleTaskCompletion = async (taskId, completed) => {
    try {
      await axios.put(`${uri}/tasks/${taskId}`, { completed: !completed });
      const updatedTaskList = taskList.map((task) => {
        if (task._id === taskId) {
          return { 
            ...task, 
            completed: !completed, 
            updatedAt: formatInTimeZone(new Date(), 'America/New_York', 'PPpp') 
          };
        }
        return task;
      }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setTaskList(updatedTaskList);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      setError(`Error: ${error.response.status} - ${error.response.data}`);
    } else if (error.request) {
      setError("Network error: No response received from server");
    } else {
      setError(`Error: ${error.message}`);
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const estTime = formatInTimeZone(now, 'America/New_York', 'PPpp'); // Human-readable format
    return estTime;
  };

  const startEditing = (task) => {
    setEditingId(task._id);
    setEditedTask(task.title);
    setEditedDueDate(task.dueDate ? formatInTimeZone(new Date(task.dueDate), 'America/New_York', 'PPpp') : '');
  };

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
            min={getCurrentDateTime()}
            placeholder="Due Date"
          />
          <button className='addButton' onClick={addTask}>Add Task</button>
        </div>

        <div className="todo-container" onClick={() => setEditingId(null)}>
          <ul className="taskList" onClick={(e) => e.stopPropagation()}>
            {taskList.filter(task => !task.completed).map((task) => {
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
                    <>
                      <div className="editContainer">
                        <label className="editLabel">Edit Task:</label>
                        <input
                          className='editTask'
                          autoFocus
                          type="text"
                          value={editedTask}
                          onChange={(e) => setEditedTask(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              updateTask(task._id);
                            } else if (e.key === 'Escape') {
                              setEditedTask(task.title);
                              setEditingId(null);
                            }
                          }}
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
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              updateTask(task._id);
                            } else if (e.key === 'Escape') {
                              setEditedDueDate(task.dueDate ? formatInTimeZone(new Date(task.dueDate), 'America/New_York', 'yyyy-MM-dd\'T\'HH:mm') : '');
                              setEditingId(null);
                            }
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className={`taskItem ${isOverdue ? 'overdueTaskItem' : ''} ${editingId === task._id ? 'editing' : ''}`}>
                      <span className="taskTitle">{task.title}</span>
                      <div className="timestampContainer">
                        {task.dueDate && <span className={`timestamp ${isOverdue ? 'overdueDueDate' : ''}`}>Due: {task.dueDate}</span>}
                        <span className="timestamp">Created: {task.createdAt}</span>
                        <span className="timestamp">Updated: {task.updatedAt}</span>
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

          <hr className="divider" />

          <h2 className="completedTaskTitle">Completed Tasks</h2>
          <ul className="taskList" onClick={(e) => e.stopPropagation()}>
            {taskList.filter(task => task.completed).map((task) => (
              <li
                className={`listItem ${task.completed ? 'completedTask' : ''}`}
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
                  <>
                    <div className="editContainer">
                      <label className="editLabel">Edit Task:</label>
                      <input
                        className='editTask'
                        autoFocus
                        type="text"
                        value={editedTask}
                        onChange={(e) => setEditedTask(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateTask(task._id);
                            setEditedDueDate(task.dueDate ? formatInTimeZone(new Date(task.dueDate), 'America/New_York', 'yyyy-MM-dd\'T\'HH:mm') : '');
                          } else if (e.key === 'Escape') {
                            setEditedTask(task.title);
                            setEditingId(null);
                          } else if (e.key === 'Tab') {
                            setEditingId(null);
                          }
                        }}
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
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateTask(task._id);
                          } else if (e.key === 'Escape') {
                            setEditedDueDate(task.dueDate ? formatInTimeZone(new Date(task.dueDate), 'America/New_York', 'yyyy-MM-dd\'T\'HH:mm') : '');
                            setEditingId(null);
                          }
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="taskItem">
                    <span className="taskTitle">{task.title}</span>
                    <div className="timestampContainer">
                      {task.dueDate && <span className="timestamp">Due: {task.dueDate}</span>}
                      <span className="timestamp">Created: {task.createdAt}</span>
                      <span className="timestamp">Updated: {task.updatedAt}</span>
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
            ))}
          </ul>
        </div>
      </div>
    </React.StrictMode>
  );
}

export default List;