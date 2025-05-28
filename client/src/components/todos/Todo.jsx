import React, { useState } from "react";
import ApiService from "../../services/ApiService";
import styles from "./Todos.module.css";

const Todo = ({ todo, index, updateTodos, setError }) => {
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  const handleDelete = async (id) => {
    try {
      await ApiService.request({
        url: `http://localhost:3000/todos/${id}`,
        method: "DELETE",
      });

      updateTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggle = async (id, completed) => {
    try {
      await ApiService.request({
        url: `http://localhost:3000/todos/${id}`,
        method: "PATCH",
        body: { completed: !completed },
      });
      updateTodos((prevTodos) => {
        const updatedTodos = [...prevTodos];
        updatedTodos[index] = { ...updatedTodos[index], completed: !completed };
        return updatedTodos;
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditTodo = async (id) => {
    try {
      await ApiService.request({
        url: `http://localhost:3000/todos/${id}`,
        method: "PATCH",
        body: { title: editedTitle },
      });
      updateTodos((prevTodos) => {
        const updatedTodos = [...prevTodos];
        updatedTodos[index] = { ...updatedTodos[index], title: editedTitle };
        return updatedTodos;
      });
      setEditingTodo(null);
      setEditedTitle("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.todoItem}>
      {editingTodo === todo.id ? (
        <div className={styles.editContainer}>
          <input
            className={styles.editInput}
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <button
            className={styles.editButton}
            onClick={() => handleEditTodo(todo.id)}
          >
            Save
          </button>
          <button
            className={styles.deleteButton}
            onClick={() => setEditingTodo(null)}
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <div className={styles.todoContent}>
            <strong>{todo.id}</strong>. {todo.title}
          </div>

          <div className={styles.editContainer}>
            <button
              className={styles.editButton}
              onClick={() => {
                setEditedTitle(todo.title);
                setEditingTodo(todo.id);
              }}
            >
              ✏️
            </button>
            <button
              className={styles.deleteButton}
              onClick={() => handleDelete(todo.id)}
            >
              🗑️
            </button>
            <input
              className={styles.toggleCheckbox}
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id, todo.completed)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Todo;
