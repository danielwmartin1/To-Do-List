import React, { useState, useEffect } from 'react';
import axios from 'axios';

function List() {
  const [newTask, setNewTask] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedTask, setEditedTask] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/tasks");
      setTaskList(response.data);
    } catch (error) {
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
      await axios.post('http://localhost:4000/tasks', { title: newTask });
      setNewTask('');
      fetchData();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const editTask = (id) => {
    setEditingId(id);
    const taskToEdit = taskList.find(task => task._id === id);
    if (taskToEdit) {
      setEditedTask(taskToEdit.title);
    }
  };

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

  const toggleTaskCompletion = async (id, completed) => {
    try {
      await axios.patch(`http://localhost:4000/tasks/${id}`, { completed: !completed });
      fetchData();
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const removeTask = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/tasks/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <React.StrictMode>
      <div id='container'>
        <div className="todo-container">
          <ul className="taskList">
            {taskList.map((task) => (
              <li className={`listItem ${task.completed ? 'completedTask' : ''}`} key={task._id} onClick={() => editTask(task._id)}>
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task._id, task.completed)}
                  onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
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
                    <span style={{ textDecoration: 'line-through', opacity: 0.5 }}>{task.title}</span>
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