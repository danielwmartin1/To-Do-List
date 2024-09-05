import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
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
        updatedAt: format(new Date(task.updatedAt), 'PPpp'),
        createdAt: format(new Date(task.createdAt), 'PPpp'),
        dueDate: task.dueDate ? format(new Date(task.dueDate), 'PPpp') : null,
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
    try {
      const response = await axios.post(`${uri}/tasks`, { title: newTask, dueDate });
      const formattedTask = {
        ...response.data,
        updatedAt: format(new Date(response.data.updatedAt), 'PPpp'),
        createdAt: format(new Date(response.data.createdAt), 'PPpp'),
        dueDate: response.data.dueDate ? format(new Date(response.data.dueDate), 'PPpp') : null,
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
      // eslint-disable-next-line
      const response = await axios.put(`${uri}/tasks/${taskId}`, { title: editedTask, dueDate: editedDueDate });
      const updatedTaskList = taskList.map((task) => {
        if (task._id === taskId) {
          return { ...task, title: editedTask, dueDate: editedDueDate ? format(new Date(editedDueDate), 'PPpp') : null, updatedAt: format(new Date(), 'PPpp') };
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
          return { ...task, completed: !completed, updatedAt: format(new Date(), 'PPpp') };
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
            placeholder="Due Date"
          />
          <button className='addButton' onClick={addTask}>Add Task</button>
        </div>

        <div className="todo-container" onClick={() => setEditingId(null)}>
          <ul className="taskList" onClick={(e) => e.stopPropagation()}>
            {taskList.filter(task => !task.completed).map((task) => (
              <li
                className={`listItem ${task.completed ? 'completedTask' : ''}`}
                key={task._id}
                onClick={() => {
                  if (!task.completed) {
                    setEditingId(task._id);
                    setEditedTask(task.title);
                    setEditedDueDate(task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd\'T\'HH:mm') : '');
                  } else if (editingId === task._id) {
                    setEditingId(null);
                  }
                }}
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
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateTask(task._id);
                          } else if (e.key === 'Escape') {
                            setEditedDueDate(task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd\'T\'HH:mm') : '');
                            setEditingId(null);
                          }
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <div className={`taskItem ${editingId === task._id ? 'editing' : ''}`}>
                    <span className="taskTitle">{task.title}</span>
                    <div className="timestampContainer">
                      {task.dueDate && <span className="timestamp">Due: {task.dueDate}</span>}
                      <span className="timestamp">Created: {task.createdAt}</span>
                      <span className="timestamp">Updated: {task.updatedAt}</span>
                    </div>
                  </div>
                )}
                <button
                  className="removeButton"
                  onClick={(e) => { e.stopPropagation(); removeTask(task._id); }}
                  aria-label={`Remove task "${task.title}"`}
                >Remove</button>
              </li>
            ))}
          </ul>

          <hr className="divider" />

          <h2 className="completedTaskTitle">Completed Tasks</h2>
          <ul className="taskList" onClick={(e) => e.stopPropagation()}>
            {taskList.filter(task => task.completed).map((task) => (
              <li
                className={`listItem ${task.completed ? 'completedTask' : ''}`}
                key={task._id}
                onClick={() => {
                  if (!task.completed) {
                    setEditingId(task._id);
                    setEditedTask(task.title);
                    setEditedDueDate(task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd\'T\'HH:mm') : '');
                  } else {
                    setEditingId(null);
                  }
                }}
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
                            setEditedDueDate(task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd\'T\'HH:mm') : '');
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
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateTask(task._id);
                          } else if (e.key === 'Escape') {
                            setEditedDueDate(task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd\'T\'HH:mm') : '');
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
                <button
                  className="removeButton"
                  onClick={(e) => { e.stopPropagation(); removeTask(task._id); }}
                  aria-label={`Remove task "${task.title}"`}
                >Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </React.StrictMode>
  );
}

export default List;