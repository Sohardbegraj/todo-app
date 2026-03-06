import React from "react"
import { useState , useEffect } from "react";

export default function TodoApp() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

      useEffect(() => {
        fetch("http://localhost:5000/api/todos")
          .then(res => res.json())
          .then(data => setTodos(data));
      }, []);

  const addTodo = async () => {
  const res = await fetch("http://localhost:5000/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: task })
  });

  const newTodo = await res.json();
  setTodos([...todos, newTodo]);
};

  const toggleTodo = (_id) => {
    setTodos(
      todos.map((t) =>
        t._id === _id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTodo = async (id) => {
  await fetch(`http://localhost:5000/api/todos/${id}`, {
    method: "DELETE"
  });
  setTodos(todos.filter(todo => todo._id !== id));
  };


  const startEdit = (todo) => {
  setEditingId(todo._id);
  setEditText(todo.text);
};

const saveEdit = async (id) => {

  const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: editText })
  });

  const updatedTodo = await res.json();

  setTodos(
    todos.map((t) =>
      t._id === id ? updatedTodo : t
    )
  );

  setEditingId(null);
  setEditText("");
};
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Todo App</h1>

        <div className="flex gap-2 mb-4">
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter task..."
            className="flex-1 border rounded-xl px-3 py-2"
          />
          <button
            onClick={addTodo}
            className="bg-black text-white px-4 py-2 rounded-xl"
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="flex items-center justify-between bg-gray-50 p-3 shadow-xl rounded-2xl"
            >
             {editingId === todo._id ? (
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="border px-2 py-1 rounded"
              />
            ) : 
            (  <span
                onClick={() => toggleTodo(todo._id)}
                className={`cursor-pointer ${
                  todo.completed ? "line-through text-gray-400" : ""
                }`}
              >
                <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo._id)}
                className="w-4 h-4 mr-3"
              />
                {todo.text}
              </span>
              )}
              <div className="flex gap-2">
      {editingId === todo._id ? (
        <button
          onClick={() => saveEdit(todo._id)}
          className="text-green-600"
        >
          Save
        </button>
      ) : (
        <button
          onClick={() => (
            startEdit(todo)
          )}
          className="text-blue-500"
        >
          Edit
        </button>
      )}

      <button
        onClick={() => deleteTodo(todo._id)}
        className="text-red-500"
      >
        Delete
      </button>
    </div>
  </li>
))}
        </ul>
      </div>
    </div>
  );
}

