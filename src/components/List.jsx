import React, { useState , useEffect} from 'react';
import axios from "axios";
// Define List component
function List() {
  
  // Define state variables
  const [newTask, setNewTask] = useState(''); // value for new task input being added
  const [taskList, setTaskList] = useState([]); // taskList array to store tasks
  const [editingIndex, setEditingIndex] = useState(null); // state for the index of the task being edited 
  const [editedTask, setEditedTask] = useState(''); // value of edited task input


  // Function to fetch data using Axios
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/tasks");
      console.log("response", response);
      //setData(response.data);
      const taskData = response.data.map((task) => task.title);
      setTaskList(taskData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Call fetchData on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Define function for adding tasks 
  const addTask = () => {
    console.log("addTask called");
    if (!newTask.trim()) { // check if the new task is empty
      alert('Please enter a task.'); // show an alert if the new task is empty   
      return;
    }
    setTaskList([...taskList, newTask]); // push new task to the rest of tasks list  
    console.log(taskList); 
    setNewTask(''); // clear the new task input 
  }

  // Define function for removing tasks  
  const removeTask = (e, listIndex) => {
    console.log(`removeTask called for index ${listIndex}`);
    const updatedTasks = taskList.filter((currentElement, index) => index !== listIndex); //filters out the task at the specified index  
    setTaskList(updatedTasks); // update the tasks list
    e.stopPropagation();// stops the click event from propagating up the dom tree
  };

  // Define function for editing tasks  
  const editTask = (listIndex) => {
    console.log(`handleEditTask called for edit ${listIndex}`);
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
    <React.StrictMode>
      <div id='container'>
        <div 
          onBlur={() => editTask(null)}
          className="todo-container"
        >
          <ul className="taskList"> {taskList.map((taskList, listIndex) => ( // map over the tasks list
              <li 
                className='listItem' 
                key={listIndex} 
                onClick={() => editTask(listIndex)}> 
                {editingIndex === listIndex ? (      // check if the task is being edited
                  <input 
                    autoFocus
                    type="text" 
                    value={editedTask} // display the edited task value
                    onChange={(e) => setEditedTask(e.target.value)} // update edited task value
                      onKeyDown={(e) => { // save changes on Enter key press
                      if (e.key === 'Enter') { // save changes on Enter key press
                        updateTask(listIndex);
                      }
                      }}
                  />) : ( 
                      <span>{taskList}</span> // display the task
                    )}
                <button 
                  className="removeButton" 
                  onClick={(e) => removeTask(e, listIndex)}> Remove </button>
              </li>
            ))}
          </ul>
    
          <div className="inputContainer">
            <input // add input for new task
              autoFocus
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
    </React.StrictMode>
  );
}

export default List;
