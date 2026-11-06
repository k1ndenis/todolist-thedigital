import { useState, type FormEvent } from 'react'
import './App.css'

type Todo = {
  id: number
  title: string
  completed: boolean
}

const initialTodos: Todo[] = [
  { id: 1, title: 'Подготовить прототип интерфейса', completed: true },
  { id: 2, title: 'Проверить сценарий добавления задач', completed: false },
  { id: 3, title: 'Поделиться результатом с командой', completed: false },
]

function App() {
  const [todos, setTodos] = useState(initialTodos)
  const [newTodo, setNewTodo] = useState('')

  const addTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const title = newTodo.trim()

    if (!title) return

    setTodos((currentTodos) => [
      ...currentTodos,
      { id: Date.now(), title, completed: false },
    ])
    setNewTodo('')
  }

  const toggleTodo = (id: number) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  const removeTodo = (id: number) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id))
  }

  const completedCount = todos.filter((todo) => todo.completed).length

  return (
    <main className="app-shell">
      <section className="todo-card" aria-labelledby="page-title">
        <div className="todo-card__header">
          <div>
            <p className="eyebrow">Мои задачи</p>
            <h1 id="page-title">To-Do List</h1>
          </div>
          <span className="progress" aria-label={`Выполнено ${completedCount} из ${todos.length}`}>
            {completedCount}/{todos.length}
          </span>
        </div>

        <form className="todo-form" onSubmit={addTodo}>
          <label className="sr-only" htmlFor="new-todo">
            Новая задача
          </label>
          <input
            id="new-todo"
            value={newTodo}
            onChange={(event) => setNewTodo(event.target.value)}
            placeholder="Например, ответить на письма"
          />
          <button type="submit">Добавить</button>
        </form>

        <ul className="todo-list" aria-label="Список задач">
          {todos.map((todo) => (
            <li className="todo-item" key={todo.id}>
              <label className="todo-item__content">
                <input
                  checked={todo.completed}
                  type="checkbox"
                  onChange={() => toggleTodo(todo.id)}
                />
                <span className={todo.completed ? 'todo-title todo-title--completed' : 'todo-title'}>
                  {todo.title}
                </span>
              </label>
              <button
                className="delete-button"
                type="button"
                onClick={() => removeTodo(todo.id)}
                aria-label={`Удалить задачу «${todo.title}»`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>

        {todos.length === 0 && <p className="empty-state">Список задач пуст.</p>}
      </section>
    </main>
  )
}

export default App
