import React, { useState } from 'react';

// Define List component
function List() {
  
  // Define state variables
  const [newTask, setNewTask] = useState(''); // value for new task input 
  const [taskList, setTaskList] = useState([]); // taskList state for storing tasks
  const [editingIndex, setEditingIndex] = useState(null); // state for the index of the task being edited 
  const [editedTask, setEditedTask] = useState(''); // value of edited task input


  // Define function for adding tasks 
  const addTask = () => {
    console.log("addTask called");
    if (!newTask.trim()) { // check if the new task is empty
      alert('Please enter a task.'); // show an alert if the new task is empty   
      return;
    }
    setTaskList([...taskList, newTask]); // push new task to the rest of tasks list   
    setNewTask(''); // clear the new task input 
  }

  // Define function for removing tasks  
  const removeTask = (event, listIndex) => {
    console.log(`removeTask called for index ${listIndex}`);
    const updatedTasks = taskList.filter((_, i) => i !== listIndex); //filters out the task at the specified index  
    setTaskList(updatedTasks); // update the tasks list
    event.stopPropagation();  // stops the click event from propagating up the dom tree
  };

  // Define function for editing tasks  
  const editTask = (listIndex) => {
    console.log(`editTask called for edit ${listIndex}`);
    setEditingIndex(listIndex); // set the editingIndex to the listIndex being edited   
    setEditedTask(taskList[listIndex]); // set the value of the edited task input to the value of the task being edited
  };

  // Define function for updating edited task 
  const updateTask = (listIndex) => { // pass the index of the task to be updated 
    console.log(`updateTask called for index ${listIndex}`);
    const updatedTasks = [...taskList]; // make a copy of the current tasks 
    updatedTasks[listIndex] = editedTask; // update the task at the specified index with the value of the edited task input
    setTaskList(updatedTasks); // update the tasks list 
    setEditingIndex(null); // reset editing index 
    setEditedTask(''); // reset edited task value 
  };


  // Render/Return the JSX for the List component 
  return (
    <div id='container'>
      <div className="todo-container">

        <ul className="taskList"> {taskList.map((taskList, listIndex) => ( // map over the tasks list
            <li className='listItem' key={listIndex} onClick={() => editTask(listIndex)}> 
              {editingIndex === listIndex ? (      // check if the task is being edited
                <input type="text" 
                  value={editedTask} // display the edited task value
                  onChange={(e) => setEditedTask(e.target.value)} // update edited task value
                  onKeyDown={(e) => { // save changes on Enter key press
                    if (e.key === 'Enter') { // save changes on Enter key press
                      updateTask(listIndex);
                    }
                  }}
                  onBlur={() => updateTask(listIndex)} // save changes on blur
                  autoFocus />
              ) : (
                  <span>{taskList}</span> // display the task
                )}

              <button className="removeButton" onClick={(event) => removeTask(event, listIndex)}>{/* add button to remove task */}Remove</button>
            </li>
          ))}
        </ul>
        <div className="inputContainer">
          <input // add input for new task
            className="newTask"
            type="text"
            value={newTask} // display the newTask value
            onChange={(e) => setNewTask(e.target.value)} // update newTask state
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addTask();
                console.log("Add task");
              }
            }}
          />
          <button className='addButton' onClick={addTask}>Add Task</button> {/* add button to add task */}
        </div>
      </div>
    </div>
  );
}

export default List;
