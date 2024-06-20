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
  const addTask = async (req, res, next) => {
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
      const taskToEdit = taskList.find(task => task.id === id);
      if (taskToEdit) {
        setEditedTask(taskToEdit.title);
      } else {
      console.error(`No task found with id: ${id}`);
      }
  };
  
// update a task
  const updateTask = async (id) => {
    console.log(`updateTask called for id ${id}`);
    const updatedTasks = taskList.map(task => 
      task.id === id ? { ...task, title: editedTask } : task
    );
    setTaskList(updatedTasks);
    setEditingId(null);
    setEditedTask('');
    if (editedTask) {
      try {
        await axios.put(`http://localhost:4000/tasks/${id}`, {
          title: editedTask,
        });
      } catch (error) {
        console.error("Error updating task:", error);
      }
    } else {
      console.error("edited task is empty");
    }
  };
// remove a task
  const removeTask = async (e, id) => {
    console.log(`removeTask called for id ${id}`);
    const updatedTasks = taskList.filter(task => task.id !== id);
    setTaskList(updatedTasks);
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:4000/tasks/${id}`);
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
                key={task.id} 
                onClick={() => editTask(task.id)}> 
                {editingId === task.id ? (
                  <input 
                    autoFocus
                    type="text" 
                    value={editedTask}
                    onChange={(e) => setEditedTask(e.target.value)} // update edited task value
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updateTask(task.id); // save changes on Enter key press
                      }
                    }}
                  />) : ( 
                      <span>{task.title}</span> // display the task
                    )}
                <button 
                  className="removeButton" 
                  onClick={(e) => removeTask(e, task.id)}> Remove </button>
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