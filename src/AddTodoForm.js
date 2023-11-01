import React,{useState} from "react";

function AddTodoForm(props) {
  
  const [todoTitle, setTodoTitle] = useState([])
  
  const handleTitleChange = (event) => {
    event.preventDefault();
    
    let newTodoTitle = event.target.value
    setTodoTitle(newTodoTitle)
  }

  const handleAddTodo = (event) => {
    event.preventDefault();
    
    let newTodoTitle = event.target.title.value;
    props.onAddTodo([newTodoTitle])

    
  }

  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle"> Title </label>
      <input  value={todoTitle} onChange={handleTitleChange} type="text" id="todoTitle" name="title"/>
      <button type="submit"> Add</button>
    </form>
  );
}

export default AddTodoForm;