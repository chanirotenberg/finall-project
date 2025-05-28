import React, { useEffect, useState } from "react";
import { useUser } from "../../services/UserContext";
import ApiService from "../../services/ApiService";
import SearchService from "../../services/SearchService";
import Todo from "./Todo";
import styles from "./Todos.module.css";

const Todos = () => {
  const [criteria, setCriteria] = useState("");
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterByCompletion, setFilterByCompletion] = useState(false);

  const { currentUser } = useUser();

  useEffect(() => {
    const fetchTodos = async () => {
      if (!currentUser?.id) {
        return;
      }
      try {
        const data = await ApiService.request({
          url: `http://localhost:3000/todos?userId=${currentUser.id}`,
        });
        updateTodos(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTodos();
  }, [currentUser?.id]);

  const updateTodos = (updatedTodos) => {
    let resolvedTodos = updatedTodos;

    if (typeof updatedTodos === "function") {
      resolvedTodos = updatedTodos(todos);
    }

    setSearchQuery("");
    setCriteria("");

    setTodos(resolvedTodos);
    setFilteredTodos(resolvedTodos);
  };

  const handleAddTodo = async () => {
    try {
      const newTodo = {
        userId: currentUser.id,
        title: newTodoTitle,
        completed: false,
      };
      const savedTodo = await ApiService.request({
        url: "http://localhost:3000/todos",
        method: "POST",
        body: newTodo,
      });
      updateTodos((prevTodos) => [savedTodo, ...prevTodos]);
      setIsAdding(false);
      setNewTodoTitle("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSort = () => {
    setFilteredTodos(() => {
      const sortedTodos = [...todos];

      sortedTodos.sort((a, b) => {
        if (criteria === "id") {
          return a.id.toString().localeCompare(b.id.toString());
        } else if (criteria === "title") {
          return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
        } else if (criteria === "completed") {
          return a.completed - b.completed;
        }
        return 0;
      });

      return sortedTodos;
    });
  };

  const handleSearch = (searchQuery) => {
    setSearchQuery(searchQuery);
    if (!criteria) {
      setError("Please select a search criteria before searching");
      setTimeout(() => {setError("")}, 3000);
      return;
    }
    setFilteredTodos(SearchService.filterItems(searchQuery, todos, criteria));
  };

 const handleFilterByCompletion = (completedStatus) => {
  setFilterByCompletion(completedStatus);
  if (completedStatus === "completed") {
    setFilteredTodos(todos.filter((todo) => Boolean(todo.completed)));
  } else if (completedStatus === "notCompleted") {
    setFilteredTodos(todos.filter((todo) => !Boolean(todo.completed)));
  } else {
    setFilteredTodos(todos);
  }
};

  return (
    <div className={styles.todosContainer}>
      <h2 className={styles.todosHeader}>Todos</h2>
      <div className={styles.controlPanel}>
        <select
          className={styles.selectCriteria}
          value={criteria}
          onChange={(e) => {
            setCriteria(e.target.value);
          }}
        >
          <option value="">Select criteria</option>
          <option value="id">ID</option>
          <option value="title">Title</option>
          <option value="completed">Completed</option>
        </select>
        <button className={styles.sortButton} onClick={handleSort}>
          Sort
        </button>
        {criteria === "completed" ? (
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                value="completed"
                checked={filterByCompletion === "completed"}
                onChange={() => handleFilterByCompletion("completed")}
              />
              Completed
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                value="notCompleted"
                checked={filterByCompletion === "notCompleted"}
                onChange={() => handleFilterByCompletion("notCompleted")}
              />
              Not Completed
            </label>
          </div>
        ) : (
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Enter search query"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        )}
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {isAdding ? (
        <div className={styles.addTodoContainer}>
          <input
            className={styles.addTodoInput}
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="Enter todo title"
          />
          <button className={styles.addButton} onClick={handleAddTodo}>
            Save
          </button>
          <button
            className={styles.cancelButton}
            onClick={() => setIsAdding(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          className={`${styles.addButton} ${styles.addTodoButton}`}
          onClick={() => setIsAdding(true)}
        >
          + Add Todo
        </button>
      )}
      <div className={styles.todosList}>
        {filteredTodos.map((todo, index) => (
          <Todo
            key={todo.id}
            todo={todo}
            index={index}
            updateTodos={updateTodos}
            setError={setError}
          />
        ))}
      </div>
    </div>
  );
};

export default Todos;
