import Todo from "../models/Todo.js";

export const getTodos = async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
};

export const createTodo = async (req, res) => {
  const todo = new Todo({ text: req.body.text });
  const saved = await todo.save();
  res.json(saved);
};

export const updateTodo = async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    { text: req.body.text },
    { new: true }
  );
  res.json(todo);
};

export const deleteTodo = async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Todo deleted" });
};