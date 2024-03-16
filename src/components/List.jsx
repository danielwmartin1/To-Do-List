import React, { useState } from 'react';

function List() {
  // Define state variables
  const [tasks, setTasks] = useState([]); // list state for tasks
  const [newTask, setNewTask] = useState(''); // new task state for input
  const [editingIndex, setEditingIndex] = useState(null); // index of the item being edited (null if not editing)
  const [editedTask, setEditedTask] = useState(''); // value of the edited task input

  // Define function for adding tasks
  function addTask() {
    if (newTask.trim() === '') { // check if the new task is empty
      alert('Please enter a task.'); // show an alert if the new task is empty 
      return;
    }
    setTasks([...tasks, newTask]); // add new task to tasks list 
    setNewTask(''); // clear the new task input
  }

  // Define function for removing tasks 
  const removeTask = (index) => { // pass the index of the task to be removed 
    const updatedTasks = [...tasks]; // make a copy of the current tasks 
    updatedTasks.splice(index, 1); // remove the task at the specified index 
    setTasks(updatedTasks); // update the tasks list  
  };

  // Define function for editing tasks 
  const editTask = (index) => {
    setEditingIndex(index); // set the editing index to the index of the task being edited  
    setEditedTask(tasks[index]); // set the value of the edited task input to the value of the task being edited
  };

  // Define function for updating edited task 
  const updateTask = (index) => { // pass the index of the task to be updated 
    const updatedTasks = [...tasks]; // make a copy of the current tasks 
    updatedTasks[index] = editedTask; // update the task at the specified index with the value of the edited task input
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
            <li key={index} onContextMenu={(e) => { e.preventDefault(); editTask(index); }}>  {/* add right-click context menu to edit task */}
              {editingIndex === index ? ( // check if the task is being edited
                <input
                  type="text"
                  value={editedTask} // display the edited task value
                  onChange={(e) => setEditedTask(e.target.value)} // update edited task value
                  onKeyDown={(e) => { // save changes on Enter key press
                    if (e.key === 'Enter') { // save changes on Enter key press
                      updateTask(index);
                    }
                  }} 
                  autoFocus
                />
              ) : (
                <span>{task}</span> // display the task
              )}
                <button class="removeButton" onClick={() => removeTask(index)}>{/* add button to remove task */}Remove</button>
              </li>
          ))}
        </ul>
        <div class="inputContainer">
          <input // add input for new task
            id="newTask"
            type="text"
            value={newTask} // display the newTask value
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
