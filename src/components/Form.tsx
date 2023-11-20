'use client'
import { useState } from 'react'
import uuid from 'react-uuid'
import { FaTrashAlt } from 'react-icons/fa'
import dynamic from 'next/dynamic'
import indexedDB from '@/database/indexedDB'
import { useCreateIndexedDB } from '@/hooks/useCreateIndexedDB'
import { useGetIndexedDBCheckedAllData, useGetIndexedDBTodoData } from '@/hooks/useGetIndexedDBData'
import { useToastify } from '@/utils/useToastify'

// https://stackoverflow.com/questions/66374123/warning-text-content-did-not-match-server-im-out-client-im-in-div/66374800#66374800
const FormAddTodo = dynamic(() => import('../components/FormAddTodo'), { ssr: false })

const initialMessagesState = {
    error: '',
    warning: ''
}

const initialCheckedAllState: CheckedAll = {
    isCheckedAll: false,
    disabled: true
}

export default function Form(): JSX.Element {
    const [formInputValue, setFormInputValue] = useState('')
    const [todos, setTodos] = useState<Todo[]>([])
    const [messages, setMessages] = useState(initialMessagesState)
    const [checkAll, setCheckAll] = useState<CheckedAll>(initialCheckedAllState)

    const { toast } = useToastify()

    useCreateIndexedDB()
    useGetIndexedDBTodoData(setTodos)
    useGetIndexedDBCheckedAllData(setCheckAll, initialCheckedAllState)

    const loadTodosFromApi = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        event.preventDefault()

        fetch(
            'https://raw.githubusercontent.com/douglasmatosdev/todo-app-without-context-management/main/src/__mocks__/data.json'
        )
            .then(respose => respose.json())
            .then((json: Todo[]) => {
                const isDuplicate = todos.find(todo => json.map(j => j.id).includes(todo.id))

                if (isDuplicate) {
                    toast('You have already imported this data!', 'warning')
                } else {
                    setTodos([...todos, ...json])

                    json.forEach((todo, index) => {
                        setTimeout(() => {
                            indexedDB.save(todo)
                        }, 300 * index)
                    })

                    toast('Todos imported successfuly!!!', 'success')
                }
            })
    }

    const formHandleButtonAddClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        event.preventDefault()

        if (!formInputValue.trim()) {
            setMessages({
                ...messages,
                warning: 'Do not permitted empty values.'
            })

            toast('Do not permitted empty values.', 'warning')

            return
        }

        const todo = {
            id: uuid(),
            name: formInputValue.trim(),
            checked: false
        }

        indexedDB.save(todo)

        setTodos([...todos, todo])
        setFormInputValue('')

        toast('New todo added successfuly!', 'success')
    }

    const formHandleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setFormInputValue(event.target.value)
        setMessages(initialMessagesState)
    }

    const handleRemoveTodo = (id: string): void => {
        if (!confirm('Are you sure you want to remove this item?')) return

        setTodos(prev => prev.filter(todo => todo.id !== id))

        indexedDB.delete(id, setTodos)

        toast('Todo delete successfuly!', 'info')
    }

    const handleCheckTodo = (id: string): void => {
        const todoToUpdate = todos.find(todo => todo.id === id) as Todo
        todoToUpdate!.checked = !todoToUpdate.checked

        setTodos(prev => prev.map(todo => (todo.id === id ? { ...todoToUpdate } : todo)))

        const newCheckedAll = { isCheckedAll: false, disabled: true }
        setCheckAll(newCheckedAll)

        setTimeout(() => {
            indexedDB.update(todoToUpdate)
            indexedDB.checkedAll(newCheckedAll)
        }, 500)
    }

    const handleEditTodo = (event: React.ChangeEvent<HTMLInputElement>, id: string): void => {
        const todoToUpdate = todos.find(todo => todo.id === id) as Todo
        todoToUpdate!.name = event.target.value

        setTodos(prev => prev.map(todo => (todo.id === id ? { ...todoToUpdate } : todo)))

        setTimeout(() => {
            indexedDB.update(todoToUpdate)
        }, 500)
    }

    const handleRemoveAll = (): void => {
        todos.forEach((todo, index) => {
            setTimeout(() => {
                indexedDB.delete(todo.id, setTodos)
            }, 300 * index)
        })
        const newCheckedAll = { isCheckedAll: false, disabled: true }
        setCheckAll(newCheckedAll)
        toast('All todos has deleted successfuly', 'info')
    }

    const handleCheckAll = (): void => {
        const newCheckedAll = { isCheckedAll: !checkAll.isCheckedAll, disabled: false }
        setCheckAll(newCheckedAll)

        const todosUpdated = todos.map(todo => ({ ...todo, checked: !checkAll.isCheckedAll }))

        todosUpdated.forEach((todo, index) => {
            setTimeout(() => {
                indexedDB.update(todo)
            }, 300 * index)
        })

        setTodos(todosUpdated)
        indexedDB.checkedAll(newCheckedAll)
    }

    return (
        <div className="flex flex-col items-center justify-center bg-white dark:bg-[#222] w-10/12 md:w-7/12 max-w-5xl drop-shadow-2xl p-4 md:p-8 rounded-md">
            <header className="w-full p-4 mb-8">
                <h1 className="text-5xl font-salsa font-bold drop-shadow-sm text-zinc-500">Todo App</h1>
            </header>
            <span className="w-full">{messages.warning}</span>

            <FormAddTodo
                setTodos={setTodos}
                onChange={formHandleInputChange}
                onClick={formHandleButtonAddClick}
                value={formInputValue}
                loadTodosFromApi={loadTodosFromApi}
                message={{ messages, setMessages, initialMessagesState }}
            />

            <div className={`w-full ${todos.length && 'mt-8'}`}>
                {todos.length ? <h1 className="mb-4">Todos</h1> : null}

                {todos.length ? (
                    <div className="flex justify-between items-center ml-2 mr-1 border-b-2 pb-2">
                        <label htmlFor="checked-all">
                            <input
                                onChange={handleCheckAll}
                                type="checkbox"
                                name="checked-all"
                                id="checked-all"
                                checked={checkAll.isCheckedAll}
                                title="mark all todos as checked"
                            />
                        </label>
                        <button onClick={handleRemoveAll} title="delete all todos">
                            <FaTrashAlt className="dark:text-red-200 text-red-500 hover:text-red-800 dark:hover:text-red-500" />
                        </button>
                    </div>
                ) : null}
                <div>
                    {todos.map(todo => {
                        return (
                            <div
                                key={todo.id}
                                className="flex w-full justify-between items-center [&:not(:last-child)]:mb-4 hover:bg-slate-100 dark:hover:bg-slate-700 p-2"
                            >
                                <input
                                    onChange={() => handleCheckTodo(todo.id)}
                                    type="checkbox"
                                    name="checked"
                                    id="checked"
                                    checked={todo.checked}
                                    title="mark todo as checked"
                                />
                                <input
                                    className={`flex-1 text-zinc-500 dark:focus:text-white mx-2 md:mx-8 px-1 bg-transparent focus:outline-none focus:ring-1 focus:border-green-500`}
                                    name="todo-edit"
                                    id="todo-edit"
                                    type="text"
                                    value={todo.name}
                                    placeholder={todo.name}
                                    onChange={e => handleEditTodo(e, todo.id)}
                                    title="todo description"
                                />
                                <button onClick={() => handleRemoveTodo(todo.id)} title="delete todo">
                                    <FaTrashAlt className="dark:text-red-200 text-red-500 hover:text-red-800 dark:hover:text-red-500" />
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
