import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { GiConfirmed } from "react-icons/gi";
import { ImCheckboxChecked } from "react-icons/im";
import './App.css'

const App = () => {
  const [newTodo, setNewTodo] = useState('')
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null)
  const [editedText, setEditedText] = useState('');

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const response = await axios.post('/api/todos', { text: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo('');
      console.log("Succesfully added Todo : " + newTodo);

    } catch (error) {
      console.log("Error in adding todo : ", error)
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await axios.get('/api/todos');
      setTodos(response.data.reverse())
    } catch (error) {
      console.log("Error while fetching todos" + error)
    }
  };

  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
  };

  const setCompleteTodo = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id)
      const response = await axios.patch(`/api/todos/${id}`, { completed: !todo.completed });
      setTodos(todos.map((t) => t._id === id ? response.data : t));
    } catch (error) {
      console.log("Error while Toggle complete : ", error);
    }
  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.patch(`/api/todos/${id}`, {
        text: editedText
      })
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
      setEditingTodo(null);
    } catch (error) {
      console.log("Error while saveEdit ", error)
    }
  }


  const deleteTodo = async (id) => {
    try {
      const response = await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));

    } catch (error) {
      console.log("Error while Deleting Todo : ", error)
    }
  }

  useEffect(() => {
    fetchTodos();
  }, [])


  return (
    <div className='main-div' >
      <div className="main-content">
        <div>
          <h1 className='title-text' >Task Manager</h1>
        </div>
        <form onSubmit={addTodo} className='input-form' >
          <div className='input-text-btn' >
            <input className='input-box' type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="What's the Task ?" />
            <button type='submit' className='input-btn' >Add Task</button>
          </div>
        </form>
        <div className="todo-list">
          {todos.length === 0 ? (
            <div>Nothing to show</div>
          ) : (
            <div>
              {todos.map((todo) => (
                <div key={todo._id} >
                  {editingTodo === todo._id ? (
                    <div className='editing-data' >
                      <p className='main-data-text' >
                        <input type="text" value={editedText} onChange={(e) => setEditedText(e.target.value)} />
                      </p>
                      <div className='btn-box' >
                        <button onClick={() => saveEdit(todo._id)} className='data-btn' ><GiConfirmed size={20} color='white' /></button>
                        <button className='data-btn' onClick={() => setEditingTodo(null)} ><IoMdClose size={20} color='white' /></button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className='main-data' >
                        <div className="tic-text">
                          {todo.completed === true ? (
                            <button onClick={() => setCompleteTodo(todo._id)} className='complete-btn' >
                              <ImCheckboxChecked className='comp' color='blue' size={20} />
                            </button>
                          ) : (
                            <button onClick={() => setCompleteTodo(todo._id)} className='complete-btn' >
                              <ImCheckboxChecked className='uncomp' color='white' size={20} />
                            </button>
                          )}

                          <p className='main-data-text' >
                            {todo.text}
                          </p>
                        </div>
                        <div className='btn-box' >

                          <button className='data-btn' onClick={() => startEditing(todo)} >
                            <AiFillEdit size={20} color='white' />
                          </button>
                          <button onClick={() => deleteTodo(todo._id)} className='data-btn' style={{ backgroundColor: '#F54D42' }} >
                            <MdDelete size={20} color='white' />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
