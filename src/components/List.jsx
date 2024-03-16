import React, { useState } from 'react';

function List() {
  // Define state variables
  const [tasks, setTasks] = useState([]); // list state
  const [newTask, setNewTask] = useState(''); // new task state
  const [editingIndex, setEditingIndex] = useState(null); // index of the item being edited
  const [editedTask, setEditedTask] = useState(''); // value of the edited task

  // Define function for adding tasks
  function addTask() {
    if (newTask.trim() === '') {
      alert('Please enter a task.');
      return;
    }
    setTasks([...tasks, newTask]); // add new task to tasks list
    setNewTask(''); // clear the new task input
  }

  // Define function for removing tasks
  const removeTask = (index) => {
    const updatedTasks = [...tasks]; // make a copy of the current tasks
    updatedTasks.splice(index, 1); // remove the task at the specified index
    setTasks(updatedTasks); // update the tasks list
  };

  // Define function for editing tasks
  const editTask = (index) => {
    setEditingIndex(index); // set the editing index
    setEditedTask(tasks[index]); // set the value of the edited task
  };

  // Define function for updating edited task
  const updateTask = (index) => {
    const updatedTasks = [...tasks]; // make a copy of the current tasks
    updatedTasks[index] = editedTask; // update the task at the specified index
    setTasks(updatedTasks); // update the tasks list
    setEditingIndex(null); // reset editing index
    setEditedTask(''); // reset edited task value
  };

  // Render/Return the JSX for the List component
  return (
    <div id='container'>
      <div className="todo-container">
        <ul className="todo-list">
          {tasks.map((task, index) => ( // map over the tasks list
            <li key={index} onContextMenu={(e) => { e.preventDefault(); editTask(index); }}>
              {editingIndex === index ? (
                <input
                  type="text"
                  value={editedTask}
                  onChange={(e) => setEditedTask(e.target.value)} // update edited task value
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      updateTask(index);
                    }
                  }} // save changes on blur
                  autoFocus
                />
              ) : (
                <span>{task}</span>
              )}
              <button onClick={() => removeTask(index)}>Remove</button>
            </li>
          ))}
        </ul>
        <div class="inputContainer">
          <input // add input for new task
            id="newTask"
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)} // update newTask state
            placeholder="Add a new task"
            autoFocus
          />
          <button onClick={addTask}>Add Task</button> {/* add button to add task */}
        </div>
      </div>
    </div>
  );
}

export default List;
