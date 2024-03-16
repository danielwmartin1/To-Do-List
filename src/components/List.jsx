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
    setTasks([...tasks, newTask]); // add new task to tasks list
    setNewTask(''); // clear the new task input
  }
// Define function for removing tasks
  const removeTask = (index) => {
    const updatedTasks = [...tasks]; // make a copy of the current tasks
    updatedTasks.splice(index, 1); // remove the task at the specified index
    setTasks(updatedTasks); // update the tasks list
  };

  // Render/Return the JSX for the List component
  return (
    <div id='container'>
      <div className="todo-container">
        <ul className="todo-list">
          {tasks.map((task, index) => ( // map over the tasks list
            <li key={index} onClick={() => removeTask(index)}>
              {task}
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
};

export default List;
