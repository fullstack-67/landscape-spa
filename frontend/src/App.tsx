import { useEffect, useState } from "react";
import axios from "axios";
import { type TodoItem } from "./utils/types";
import { FormInput } from "./components/FromInput";
import { TodoList } from "./components/TodoList";
import { Spinner } from "./components/Spinner";

function App() {
  // Fetching data
  const [todos, setTodos] = useState<TodoItem[]>([]);
  async function fetchData() {
    const res = await axios.get<TodoItem[]>("api/todo");
    setTodos(res.data);
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      <a href="/">
        <h1>Todo (SPA)</h1>
      </a>
      <FormInput fetchData={fetchData} />
      <TodoList fetchData={fetchData} todos={todos} />
      <Spinner />
    </div>
  );
}

export default App;
