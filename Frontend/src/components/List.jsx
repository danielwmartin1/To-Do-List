import React, { useState, useEffect } from 'react';
import axios from 'axios';

function List() {
  const [newTask, setNewTask] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedTask, setEditedTask] = useState('');
  const [error, setError] = useState(null);
  const uri = 'https://todolist-backend-six-woad.vercel.app/';

  const fetchData = async () => {
    try {
      const response = await axios.get(uri);
      setTaskList(response.data);
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        setError(`Error: ${error.response.status} - ${error.response.data}`);
      } else if (error.request) {
        // Request was made but no response received
        setError("Network error: No response received from server");
      } else {
        // Something else happened while setting up the request
        setError(`Error: ${error.message}`);
      }
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) {
      alert('Please enter a task.');
      return;
    }
    try {
      const response = await axios.post(`${uri}tasks`, { title: newTask });
      setTaskList([...taskList, response.data]);
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

  // Other functions (editTask, updateTask, toggleTaskCompletion, removeTask) would follow the same pattern for error handling
  
  const updateTask = async (taskId) => {
    try {
      // Implement the logic to update the task
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
  
  const removeTask = async (taskId) => {
    try {
      await axios.delete(`${uri}tasks/${taskId}`);
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
  
  const toggleTaskCompletion = async (taskId, completed) => {
    try {
      await axios.put(`${uri}tasks/${taskId}`, { completed: !completed });
      const updatedTaskList = taskList.map((task) => {
        if (task._id === taskId) {
          return { ...task, completed: !completed };
        }
        return task;
      });
      setTaskList(updatedTaskList);
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

  return (
    <React.StrictMode>
      <div id='container'>
        {error && <div className="error">{error}</div>}
        <div className="todo-container" onClick={() => setEditingId(null)}>
          <ul className="taskList" onClick={(e) => e.stopPropagation()}>
            {taskList.map((task) => (
              <li className={`listItem ${task.completed ? 'completedTask' : ''}`} key={task._id} onClick={() => setEditingId(task._id)}>
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task._id, task.completed)}
                  onClick={(e) => { e.stopPropagation() }}
                />
                {editingId === task._id ? (
                  <input
                    autoFocus
                    type="text"
                    value={editedTask}
                    onChange={(e) => setEditedTask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && updateTask(task._id)}
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
        </div>
      </div>
    </React.StrictMode>
  );
}

export default List;
