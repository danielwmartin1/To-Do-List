import React, { useState, useEffect } from 'react';
import axios from 'axios';

function List() {
  const [newTask, setNewTask] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedTask, setEditedTask] = useState('');
  const [error, setError] = useState('');
  const uri = 'https://todolist-backend-six-woad.vercel.app';

  // Fetch data from the server
  const fetchData = async () => {
    try {
      const response = await axios.get(`${uri}/tasks`);
      // Sort the task list in descending order based on the updatedAt field
      const sortedTaskList = response.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setTaskList(sortedTaskList);
      console.log('Fetched and sorted tasks:', sortedTaskList);
    } catch (error) {
      handleError(error);
    }
  };

  // Fetch data on initial render
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  // Add a task
  const addTask = async () => {
    if (!newTask.trim()) {
      alert('Please enter a task.');
      return;
    }
    try {
      const response = await axios.post(`${uri}/tasks`, { title: newTask });
      const updatedTaskList = [response.data, ...taskList].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setTaskList(updatedTaskList); // Prepend the new task to the task list
      setNewTask('');
      console.log('Added new task:', response.data);
    } catch (error) {
      handleError(error);
    }
  };

  // Update a task
  const updateTask = async (taskId) => {
    try {
      await axios.put(`${uri}/tasks/${taskId}`, { title: editedTask });
      const updatedTaskList = taskList.map((task) => {
        if (task._id === taskId) {
          return { ...task, title: editedTask, updatedAt: new Date().toISOString() };
        }
        return task;
      }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setTaskList(updatedTaskList);
      setEditingId(null);
      setEditedTask('');
      console.log('Updated task:', taskId);
    } catch (error) {
      handleError(error);
    }
  };

  // Remove a task
  const removeTask = async (taskId) => {
    try {
      await axios.delete(`${uri}/tasks/${taskId}`);
      const updatedTaskList = taskList.filter((task) => task._id !== taskId);
      setTaskList(updatedTaskList);
      console.log('Removed task:', taskId);
    } catch (error) {
      handleError(error);
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (taskId, completed) => {
    try {
      await axios.put(`${uri}/tasks/${taskId}`, { completed: !completed });
      const updatedTaskList = taskList.map((task) => {
        if (task._id === taskId) {
          return { ...task, completed: !completed, updatedAt: new Date().toISOString() };
        }
        return task;
      }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setTaskList(updatedTaskList);
      console.log('Toggled task completion:', taskId);
    } catch (error) {
      handleError(error);
    }
  };

  // Handle errors
  const handleError = (error) => {
    if (error.response) {
      setError(`Error: ${error.response.status} - ${error.response.data}`);
    } else if (error.request) {
      setError("Network error: No response received from server");
    } else {
      setError(`Error: ${error.message}`);
    }
    console.error("API request error:", error);
  };

  // Render the component
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
                    setEditedTask(task.title); // Set the editedTask state with the current task's title
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
                  <input
                    className='editTask'
                    autoFocus
                    type="text"
                    value={editedTask}
                    onChange={(e) => {
                      console.log('Edited task changed:', e.target.value);
                      setEditedTask(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        console.log('Enter key pressed, updating task:', task._id);
                        updateTask(task._id);
                      } else if (e.key === 'Escape') {
                        console.log('Escape key pressed, resetting edited task to:', task.title);
                        setEditedTask(task.title); // Reset to the current task's title
                        setEditingId(null); // Stop editing
                      }
                    }}
                  />
                ) : (
                  task.completed ? (
                    <span 
                      className="completeTaskList" 
                      style={{opacity: 0.3 }}>{task.title}</span>
                  ) : (
                    <span>{task.title}</span>
                  )
                )}
                <button
                  className="removeButton"
                  onClick={(e) => { e.stopPropagation(); console.log('Remove button clicked, removing task:', task._id); removeTask(task._id); }}
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
                    setEditedTask(task.title); // Set the editedTask state with the current task's title
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
                  <input
                    autoFocus
                    type="text"
                    value={editedTask}
                    onChange={(e) => {
                      console.log('Edited task changed:', e.target.value);
                      setEditedTask(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        console.log('Enter key pressed, updating task:', task._id);
                        updateTask(task._id);
                      } else if (e.key === 'Escape') {
                        console.log('Escape key pressed, resetting edited task to:', task.title);
                        setEditedTask(task.title); // Reset to the current task's title
                        setEditingId(null); // Stop editing
                      }
                    }}
                  />
                ) : (
                  <span>{task.title}</span>
                )}
                <button
                  className="removeButton"
                  onClick={(e) => { e.stopPropagation(); console.log('Remove button clicked, removing task:', task._id); removeTask(task._id); }}
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