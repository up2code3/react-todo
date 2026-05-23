import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import style from "./components/mainStyle.module.css";
import Navigation from "./Navigation";
import Contact from "./Routes/Contact";
import TodoContainer from "./components/TodoContainer";

async function fetchData(setTodoList, setIsLoading) {
  const options = {
    method: "GET",
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

    const todos = data.records.map((record) => ({
      title: record.fields.title,
      id: record.id,
    }));

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
  }, [todoList, isLoading]);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className={`${style.body} `}>
                  <Navigation />
                  <TodoContainer
                    REACT_APP_TABLE_NAME={process.env.REACT_APP_TABLE_NAME}
                  />
                  <img
                    src="https://www.foodbusinessnews.net/ext/resources/2022/09/27/grocery-shop_AdobeStock_LEAD.jpeg?height=667&t=1664296643&width=1080"
                    className={`${style.cartPic}`}
                    alt="ShopCartPic"
                  />
                </div>
              </>
            }
          />

          <Route path="/Contact" element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
