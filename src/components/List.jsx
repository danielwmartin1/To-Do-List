import React, { useState , useEffect} from 'react';
import axios from "axios";

function List() {
  const [newTask, setNewTask] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedTask, setEditedTask] = useState('');
// get all tasks
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/tasks");
      console.log("response", response);
      setTaskList(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


// add a task  
const addTask = async () => {
  console.log("addTask called");
  if (!newTask.trim()) {
    alert('Please enter a task.');
    return;
  }
  try {
    await axios.post("http://localhost:4000/tasks", {
      title: newTask,
    });
    setNewTask('');
    fetchData();
  } catch (error) {
    console.error("Error adding task:", error);
  }
}
// edit a task
const editTask = async (id) => {
  setEditingId(id);
  try {
    // Fetch the latest task details from the database
    const response = await axios.get(`http://localhost:4000/tasks/${id}`);
    const taskToEdit = response.data;
    if (taskToEdit) {
      setEditedTask(taskToEdit.title);
    } else {
      console.error(`No task found with id: ${id}`);
    }
  } catch (error) {
    console.error("Error fetching task for edit:", error);
  }
};
  
// update a task
// update a task
const updateTask = async (id) => {
  if (!editedTask.trim()) {
    console.error("edited task is empty");
    return;
  }
  try {
    await axios.put(`http://localhost:4000/tasks/${id}`, {
      title: editedTask,
    });
    await fetchData(); // Refresh the task list from the backend
  } catch (error) {
    console.error("Error updating task:", error);
  } finally {
    setEditingId(null);
    setEditedTask('');
  }
};

// remove a task
const removeTask = async (id) => {
  try {
    await axios.delete(`http://localhost:4000/tasks/${id}`);
    await fetchData(); // Refresh the task list from the backend after successful deletion
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};
// render the list
  return (
    <React.StrictMode>
      <div id='container'>
        <div 
          onBlur={() => editTask(null)}
          className="todo-container"
        >
          <ul className="taskList"> {taskList.map((task) => (
              <li 
                className='listItem' 
                key={task._id} 
                onClick={() => editTask(task._id)}> 
                {editingId === task._id ? (
                  <input 
                    autoFocus
                    type="text" 
                    value={editedTask}
                    onChange={(e) => setEditedTask(e.target.value)} // update edited task value
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updateTask(task._id); // save changes on Enter key press
                      }
                    }}
                  />) : ( 
                      <span>{task.title}</span> // display the task
                    )}
                <button 
                  className="removeButton" 
                  onClick={() => removeTask(task._id)}> Remove </button>
              </li>
            ))};
          </ul>
    
          <div className="inputContainer">
            <input
              autoFocus
              className="newTask"
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addTask();
                  console.log("Add task");
                }
              }}
            />
            <button className='addButton' onClick={addTask}>Add Task</button>
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
}

export default List;