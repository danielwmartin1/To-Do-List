import React, { useState } from 'react';

function List() {
  // Define state variables
  const [tasks, setTasks] = useState([]); // taskList state for storing tasks
  const [newTask, setNewTask] = useState(''); // value for new task input 
  const [editingIndex, setEditingIndex] = useState(null); // state for the index of the task being edited 
  const [editedTask, setEditedTask] = useState(''); // value for the value of the edited task input 

  // Define function for adding tasks 
  function addTask() {
    if (newTask.trim() === '') { // check if the new task is empty 
      alert('Please enter a task.'); // show an alert if the new task is empty   
      return;
    }
    setTasks([...tasks, newTask]); // push new task to the rest of tasks list  
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
        <ul className="taskList">
          {tasks.map((task, index) => ( // map over the tasks list
            <li key={index} onClick={() => editTask(index)}>  {/* add click event to edit task */}
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
                    onBlur={() => updateTask(index)} // save changes on blur
                  autoFocus
                />
              ) : (
                <span>{task}</span> // display the task
              )}
                <button className="removeButton" onClick={() => removeTask(index)}>{/* add button to remove task */}Remove</button>
              </li>
          ))}
        </ul>
        <div className="inputContainer">
          <input // add input for new task
            className="newTask"
            type="text"
            value={newTask} // display the newTask value
            onChange={(e) => setNewTask(e.target.value)} // update newTask state
            placeholder="Add a new task"
            autoFocus
          />
          <button className='addButton' onClick={addTask}>Add Task</button> {/* add button to add task */}
        </div>
      </div>
    </div>
  );
}

export default List;
