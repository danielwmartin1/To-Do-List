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

  // Toggle sort order
  const toggleSort = () => {
    const sortedTaskList = [...taskList].sort((a, b) => {
      if (!isAscending) {
        return a._id < b._id ? -1 : 1;
      } else {
        return a._id > b._id ? -1 : 1;
      }
    });
    setTaskList(sortedTaskList);
    setIsAscending(!isAscending); // Toggle the sort order
  };

  // Render the component
  return (
    <React.StrictMode>
      <div id='container'>
        <nav className="navBar"> 
          <button className="sortButton" onClick={toggleSort}>Sort <span className="arrows">&#8645;</span></button>
        </nav>
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
                  onClick={(e) => { e.stopPropagation(); }}
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