import React, { useState, useEffect } from 'react';
import axios from 'axios';

function List() {
  // State variables
  const [newTask, setNewTask] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedTask, setEditedTask] = useState('');

  // Fetch data from the server
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/tasks");
      setTaskList(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // CRUD operations
  // Create a new task
  const addTask = async () => {
    if (!newTask.trim()) {
      alert('Please enter a task.');
      return;
    }
    try {
      await axios.post('http://localhost:4000/tasks', { title: newTask });
      setNewTask('');
      fetchData();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Edit a task
  const editTask = async (id) => {
    setEditingId(id);
    try {
      const response = await axios.get(`http://localhost:4000/tasks/${id}`);
      setEditedTask(response.data.title);
    } catch (error) {
      console.error('Error fetching task for edit:', error);
    }
  };

  // Update a task
  const updateTask = async (id) => {
    if (!editedTask.trim()) {
      console.error('Edited task is empty');
      return;
    }
    try {
      await axios.put(`http://localhost:4000/tasks/${id}`, { title: editedTask });
      fetchData();
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setEditingId(null);
      setEditedTask('');
    }
  };

// Delete a task
  const removeTask = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/tasks/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Render
  return (
    <React.StrictMode>
      <div id='container'>
        <div className="todo-container">
          {/* The list of tasks */}
          <ul className="taskList">
            {/* Loop through the taskList array and display each task */}
            {taskList.map((task) => (
              <li className='listItem' key={task._id} onClick={() => editTask(task._id)}>
                {/* If the task is being edited, display an input field; otherwise, display the task title */}
                {editingId === task._id ? (
                  // The input field for editing the task
                  <input
                    autoFocus
                    type="text"
                    value={editedTask}
                    onChange={(e) => setEditedTask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && updateTask(task._id)}
                  />
                ) : (
                  <span>{task.title}</span>
                )}
                {/* Remove button */}
                <button className="removeButton" onClick={() => removeTask(task._id)}>Remove</button>
              </li>
            ))}
          </ul>
          {/* The input field and the Add Task button */}
          <div className="inputContainer">
            <input
              autoFocus
              className="newTask"
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
            />
            {/* Add Task button */}
            <button className='addButton' onClick={addTask}>Add Task</button>
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
}

export default List;