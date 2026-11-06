import { useEffect, useState } from 'react'
import type { Todo } from '../types/todo'

const STORAGE_KEY = 'todos'

export const initialTodos: Todo[] = [
  { id: 1, title: 'Подготовить прототип интерфейса', completed: true },
  { id: 2, title: 'Проверить сценарий добавления задач', completed: false },
  { id: 3, title: 'Поделиться результатом с командой', completed: false },
]

const isTodo = (value: unknown): value is Todo => {
  if (typeof value !== 'object' || value === null) return false

  const todo = value as Record<string, unknown>
  return (
    typeof todo.id === 'number' &&
    Number.isSafeInteger(todo.id) &&
    todo.id >= 0 &&
    typeof todo.title === 'string' &&
    todo.title.trim().length > 0 &&
    typeof todo.completed === 'boolean'
  )
}

const getNextTodoId = (todos: Todo[]): number | null => {
  const usedIds = new Set(todos.map((todo) => todo.id))
  const maxId = todos.reduce((max, todo) => Math.max(max, todo.id), -1)

  if (maxId < Number.MAX_SAFE_INTEGER) {
    return maxId + 1
  }

  for (let candidate = 0; candidate <= Number.MAX_SAFE_INTEGER; candidate += 1) {
    if (!usedIds.has(candidate)) return candidate
  }

  return null
}

const isTodoList = (value: unknown): value is Todo[] => {
  if (!Array.isArray(value) || !value.every(isTodo)) return false

  const ids = value.map((todo) => todo.id)
  return new Set(ids).size === ids.length
}

const readTodos = (): Todo[] => {
  try {
    const storedTodos = window.localStorage.getItem(STORAGE_KEY)
    if (!storedTodos) return initialTodos

    const parsedTodos: unknown = JSON.parse(storedTodos)
    return isTodoList(parsedTodos) ? parsedTodos : initialTodos
  } catch {
    return initialTodos
  }
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window === 'undefined') return initialTodos
    return readTodos()
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    } catch {
      // localStorage may be unavailable or read-only; the in-memory list still works.
    }
  }, [todos])

  const addTodo = (title: string) => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return false

    const nextId = getNextTodoId(todos)
    if (nextId === null) return false

    setTodos((currentTodos) => [
      ...currentTodos,
      {
        id: nextId,
        title: trimmedTitle,
        completed: false,
      },
    ])
    return true
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

  return { todos, addTodo, toggleTodo, removeTodo }
}
