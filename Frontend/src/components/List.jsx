import React, { useState, useEffect } from 'react';
import axios from 'axios';

function List() {
  const [newTask, setNewTask] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedTask, setEditedTask] = useState('');
  const [error, setError] = useState('');
  const [isAscending, setIsAscending] = useState(false); // State to keep track of sort order
  const uri = 'https://todolist-backend-six-woad.vercel.app';

  // Fetch data from the server
  const fetchData = async () => {
    try {
      const response = await axios.get(`${uri}/tasks`);
      // Sort the task list in descending order based on the _id field
      const sortedTaskList = response.data.sort((a, b) => b._id.localeCompare(a._id));
      setTaskList(sortedTaskList);
    } catch (error) {
      if (error.response) {
        setError(`Error: ${error.response.status} - ${error.response.data}`);
      } else if (error.request) {
        setError("Network error: No response received from server");
      } else {
        setError(`Error: ${error.message}`);
      }
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data on initial render
  useEffect(() => {
    fetchData();
    setIsAscending(() => true); // Set the initial sort order to descending
  }, []);

  // Add a task
  const addTask = async () => {
    if (!newTask.trim()) {
      alert('Please enter a task.');
      return;
    }
    try {
      const response = await axios.post(`${uri}/tasks`, { title: newTask });
      setTaskList([response.data, ...taskList]); // Prepend the new task to the task list
      setNewTask('');
    } catch (error) {
      if (error.response) {
        setError(`Error: ${error.response.status} - ${error.response.data}`);
      } else if (error.request) {
        setError("Network error: No response received from server");
      } else {
        setError(`Error: ${error.message}`);
      }
      console.error("Error adding task:", error);
    }
  };

  // Update a task
  const updateTask = async (taskId) => {
    try {
      await axios.put(`${uri}/tasks/${taskId}`, { title: editedTask });
      const updatedTaskList = taskList.map((task) => {
        if (task._id === taskId) {
          return { ...task, title: editedTask };
        }
        return task;
      });
      setTaskList(updatedTaskList);
      setEditingId(null);
      setEditedTask('');
    } catch (error) {
      if (error.response) {
        setError(`Error: ${error.response.status} - ${error.response.data}`);
      } else if (error.request) {
        setError("Network error: No response received from server");
      } else {
        setError(`Error: ${error.message}`);
      }
      console.error("Error updating task:", error);
    }
  };

  // Remove a task
  const removeTask = async (taskId) => {
    try {
      await axios.delete(`${uri}/tasks/${taskId}`);
      const updatedTaskList = taskList.filter((task) => task._id !== taskId);
      setTaskList(updatedTaskList);
    } catch (error) {
      if (error.response) {
        setError(`Error: ${error.response.status} - ${error.response.data}`);
      } else if (error.request) {
        setError("Network error: No response received from server");
      } else {
        setError(`Error: ${error.message}`);
      }
      console.error("Error removing task:", error);
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (taskId, completed) => {
    try {
      await axios.put(`${uri}/tasks/${taskId}`, { completed: !completed });
      const updatedTaskList = taskList.map((task) => {
        if (task._id === taskId) {
          return { ...task, completed: !completed };
        }
        return task;
      });
      // Move the task to the appropriate list
      const updatedTask = updatedTaskList.find(task => task._id === taskId);
      const incompleteTasks = updatedTaskList.filter(task => !task.completed);
      const completedTasks = updatedTaskList.filter(task => task.completed);
      if (updatedTask.completed) {
        setTaskList([...incompleteTasks, updatedTask, ...completedTasks.filter(task => task._id !== taskId)]);
      } else {
        setTaskList([updatedTask, ...incompleteTasks.filter(task => task._id !== taskId), ...completedTasks]);
      }
    } catch (error) {
      if (error.response) {
        setError(`Error: ${error.response.status} - ${error.response.data}`);
      } else if (error.request) {
        setError("Network error: No response received from server");
      } else {
        setError(`Error: ${error.message}`);
      }
      console.error("Error toggling task completion:", error);
    }
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
                    autoFocus
                    type="text"
                    value={editedTask}
                    onChange={(e) => setEditedTask(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updateTask(task._id);
                      } else if (e.key === 'Escape') {
                        setEditedTask(task.title); // Reset to the current task's title
                        setEditingId(null); // Stop editing
                      }
                    }}
                  />
                ) : (
                  task.completed ? (
                    <span style={{ textDecoration: 'line-through', opacity: 0.3 }}>{task.title}</span>
                  ) : (
                    <span>{task.title}</span>
                  )
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
                    onChange={(e) => setEditedTask(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updateTask(task._id);
                      } else if (e.key === 'Escape') {
                        setEditedTask(task.title); // Reset to the current task's title
                        setEditingId(null); // Stop editing
                      }
                    }}
                  />
                ) : (
                  task.completed ? (
                    <span style={{ textDecoration: 'line-through', opacity: 0.3 }}>{task.title}</span>
                  ) : (
                    <span>{task.title}</span>
                  )
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