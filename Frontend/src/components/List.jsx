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
  const [sortOrder, setSortOrder] = useState('updatedAt-desc');  // Default sort order
  const [filterStatus, setFilterStatus] = useState('all'); // Add state for filter criteria
  const [attachments, setAttachments] = useState([]);
  const [editedAttachments, setEditedAttachments] = useState([]);
  const uri = 'https://todolist-backend-six-woad.vercel.app';

  const fetchData = async () => {
    try {
      const response = await axios.get(`${uri}/tasks`);
      const sortedTaskList = response.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      const formattedTaskList = sortedTaskList.map(task => ({
        ...task,
        updatedAt: formatInTimeZone(new Date(task.updatedAt), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz'),
        createdAt: formatInTimeZone(new Date(task.createdAt), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz'),
        dueDate: task.dueDate ? formatInTimeZone(new Date(task.dueDate), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') : null,
        completedAt: task.completedAt ? formatInTimeZone(new Date(task.completedAt), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') : null,
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
      setError('Task title cannot be empty');
      return;
    }
    if (new Date(dueDate) < new Date()) {
      setError('Due date cannot be in the past');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', newTask);
      formData.append('dueDate', dueDate ? formatInTimeZone(new Date(dueDate), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') : null);
      for (let i = 0; i < attachments.length; i++) {
        formData.append('attachments', attachments[i]);
      }

      const response = await axios.post(`${uri}/tasks`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newTaskData = {
        ...response.data,
        dueDate: formData.get('dueDate'),
        createdAt: formatInTimeZone(new Date(response.data.createdAt), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz'),
        updatedAt: formatInTimeZone(new Date(response.data.updatedAt), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz'),
      };
      setTaskList((prevTaskList) => {
        const updatedList = [...prevTaskList, newTaskData];
        updatedList.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        return updatedList;
      });
      setNewTask('');
      setDueDate('');
      setAttachments([]);
      setError('');
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

      const formData = new FormData();
      formData.append('title', editedTask);
      formData.append('dueDate', editedDueDate ? formatInTimeZone(new Date(editedDueDate), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') : null);
      for (let i = 0; i < editedAttachments.length; i++) {
        formData.append('attachments', editedAttachments[i]);
      }

      const response = await axios.put(`${uri}/tasks/${taskId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedTaskList = taskList.map((task) => {
        if (task._id === taskId) {
          return { 
            ...task, 
            title: editedTask, 
            dueDate: editedDueDate ? formatInTimeZone(new Date(editedDueDate), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') : null, 
            updatedAt: formatInTimeZone(new Date(), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz'),
            attachments: response.data.attachments,
          };
        }
        return task;
      }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setTaskList(updatedTaskList);
      setEditingId(null);
      setEditedTask('');
      setEditedDueDate('');
      setEditedAttachments([]);
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
      // eslint-disable-next-line
      const response = await axios.patch(`${uri}/tasks/${taskId}`, { completed: !completed });
      const updatedTaskList = taskList.map((task) => {
        if (task._id === taskId) {
          return { 
            ...task, 
            completed: !completed, 
            completedAt: !completed ? formatInTimeZone(new Date(), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') : null,
            updatedAt: formatInTimeZone(new Date(), 'America/New_York', 'MMMM dd, yyyy hh:mm:ss a zzz') 
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
    return now.toISOString().slice(0, 16);
  };

  const startEditing = (task) => {
    setEditingId(task._id);
    setEditedTask(task.title);
    setEditedDueDate(task.dueDate ? formatInTimeZone(new Date(task.dueDate), 'America/New_York', 'yyyy-MM-dd\'T\'HH:mm') : '');
    setEditedAttachments([]);
  };

  const handleSortChange = (e) => {
    const order = e.target.value;
    setSortOrder(order);
    const sorted = [...taskList].sort((a, b) => {
      const [key, direction] = order.split('-');
      if (key === 'title') {
        if (direction === 'asc') {
          return a[key].localeCompare(b[key]);
        } else {
          return b[key].localeCompare(a[key]);
        }
      } else {
        if (direction === 'asc') {
          return new Date(a[key]) - new Date(b[key]);
        } else {
          return new Date(b[key]) - new Date(a[key]);
        }
      }
    });
    setTaskList(sorted);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const filteredTasks = taskList.filter(task => {
    if (filterStatus === 'completed') {
      return task.completed;
    } else if (filterStatus === 'incomplete') {
      return !task.completed;
    } else {
      return true;
    }
  });

  const incompleteTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

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
          <input
            type="file"
            multiple
            onChange={(e) => setAttachments(e.target.files)}
          />
          <button className='addButton' onClick={addTask}>Add Task</button>
        </div>
        <div className="sortSection">
          <div className="sortBy">
            <label htmlFor="sortTasks">Sort by: </label>
            <select id="sortTasks" value={sortOrder} onChange={handleSortChange}>
              <option className="sortOption" value="updatedAt-asc">Updated Date Ascending</option>
              <option className="sortOption" value="updatedAt-desc">Updated Date Descending</option>
              <option className="sortOption" value="dueDate-asc">Due Date Ascending</option>
              <option className="sortOption" value="dueDate-desc">Due Date Descending</option>
              <option className="sortOption" value="createdAt-asc">Created Date Ascending</option>
              <option className="sortOption" value="createdAt-desc">Created Date Descending</option>
              <option className="sortOption" value="title-asc">Title Ascending</option>
              <option className="sortOption" value="title-desc">Title Descending</option>
              <option className="sortOption" value="completedAt-asc">Completed Date Ascending</option>
              <option className="sortOption" value="completedAt-desc">Completed Date Descending</option>
            </select>
          </div>
          <div className="sortOrder">
            <label htmlFor="filterTasks">Filter Status: </label>
            <select id="filterTasks" value={filterStatus} onChange={handleFilterChange}>
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>
        </div>

        <div className="todo-container" onClick={() => setEditingId(null)}>
          <h2>Incomplete Tasks</h2>
          <ul className="taskList" onClick={(e) => e.stopPropagation()}>
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
                      </div>
                    ) : (
                      <div className={`taskItem ${isOverdue ? 'overdueTaskItem' : ''} ${editingId === task._id ? 'editing' : ''}`}>
                  <span className="taskTitle">{task.title}</span>
                  <div className="timestampContainer">
                    {task.dueDate && <span className={`timestamp ${isOverdue ? 'overdue' : ''}`}>Due: {task.dueDate}</span>}
                    <span className="timestamp">Created: {task.createdAt}</span>
                    <span className="timestamp">Updated: {task.updatedAt}</span>
                    {task.completed && <span className="timestamp">Completed: {task.completedAt}</span>}
                  </div>
                  {task.attachments && task.attachments.length > 0 && (
                    <div className="attachments">
                      {task.attachments.map((file, index) => (
                        <a key={index} href={file.url} target="_blank" rel="noopener noreferrer">
                          {file.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

                    {!task.completed && (
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
                    )}
                  </li>
                );
            })}
          </ul>

          <h2>Completed Tasks</h2>
          <ul className="taskList completedTaskList" onClick={(e) => e.stopPropagation()}>
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
                    </div>
                  ) : (
                    <div className={`taskItem ${isOverdue ? 'overdueTaskItem' : ''} ${editingId === task._id ? 'editing' : ''}`}>
                      <span className="taskTitle">{task.title}</span>
                      <div className="timestampContainer completedTimestampContainer">
                        {task.dueDate && <span className={`timestamp ${isOverdue ? 'overdue' : ''}`}>Due: {task.dueDate}</span>}
                        <span className="timestamp">Created: {task.createdAt}</span>
                        <span className="timestamp">Updated: {task.updatedAt}</span>
                        {task.completed && <span className="timestamp">Completed: {task.completedAt}</span>}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </React.StrictMode>
  );
}

export default List;