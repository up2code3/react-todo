import React, { useState } from "react";
import AddTodoForm from "./AddTodoForm";
import TodoList from "./TodoList";
import { BrowserRouter, Routes, Route} from "react-router-dom";


async function fetchData(setTodoList, setIsLoading) {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_API_TOKEN}`,
    },
  };

  const url = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/${process.env.REACT_APP_TABLE_NAME}`;
  
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("API response:", data);

    const todos = data.records.map((record) => ({
      title: record.fields.title,
      id: record.id,
    }));

    console.log("Transformed Todos:", todos);

    setTodoList(todos);
    setIsLoading(false);
  } catch (error) {
    console.error("Fetch Error:", error.message);
  }
}

function App() {
  const [todoList, setTodoList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    fetchData(setTodoList, setIsLoading);
  }, []);

  React.useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("savedTodoList", JSON.stringify(todoList));
    }
  }, [todoList,isLoading]);

  const removeTodo = (id) => {
    const newTodoList = todoList.filter((todo) => todo.id !== id);
    setTodoList(newTodoList);
  };

  const addTodo = (newTodo) => {
    setTodoList([...todoList, newTodo]);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
                <h1>Todo List</h1>
                <hr />
                <AddTodoForm onAddTodo={addTodo} />
                <hr />
                {isLoading ? (
                  <p>Loading...</p>
                ) : (
                  <TodoList todoList={todoList} onRemoveTodo={removeTodo} />
                )}
            </>
          }
        />
        <Route
        path="/new"
        element={
        <>
        <h1>New Todo List</h1>
        <hr />
        </>
        }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
