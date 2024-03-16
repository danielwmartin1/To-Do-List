import React, { useState } from 'react';

function List () {
  // Define state variables
  const [tasks, setTasks] = useState([]); // list state
  const [newTask, setNewTask] = useState(''); // new task state


  // Define functions for adding tasks
  function addTask() {
    if (newTask.trim() === '') {
      alert('Please enter a task.');
      return;
    }
    setTasks([...tasks, newTask]);
    setNewTask('');
  }
// Define function for removing tasks
  const removeTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  // Render/Return the JSX for the List component
  return (
    <div>
      <ul>
        {tasks.map((task, index) => (
          <li onClick={() => removeTask(index)} key={index}>
            {task}
          </li>
        ))}
      </ul>
      <input
        id="newTask"
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)} // update newTask state
        placeholder="Add a new task"
        autofocus />
      <button onClick={addTask}>Add Task</button>
    </div>
  );
};

export default List;
