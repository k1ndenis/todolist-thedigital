import { useState, type FormEvent } from 'react'
import { useTodos } from './hooks/useTodos'
import './App.css'

function App() {
  const { todos, addTodo, toggleTodo, removeTodo } = useTodos()
  const [newTodo, setNewTodo] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (addTodo(newTodo)) setNewTodo('')
  }

  const completedCount = todos.filter((todo) => todo.completed).length

  return (
    <main className="app-shell">
      <section className="todo-card" aria-labelledby="page-title">
        <div className="todo-card__header">
          <div>
            <p className="eyebrow">Мои задачи</p>
            <h1 id="page-title">To-Do List</h1>
            <p className="subtitle">Небольшие шаги складываются в большие результаты.</p>
          </div>
          <span className="progress" aria-label={`Выполнено ${completedCount} из ${todos.length}`}>
            {completedCount}/{todos.length}
          </span>
        </div>

        <form className="todo-form" onSubmit={handleSubmit}>
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
