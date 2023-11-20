'use client'
import { useState } from 'react'
import uuid from 'react-uuid'
import { FaTrashAlt } from 'react-icons/fa'
import dynamic from 'next/dynamic'
import indexedDB from '@/database/indexedDB'
import { useCreateIndexedDB } from '@/hooks/useCreateIndexedDB'
import { useGetIndexedDBData } from '@/hooks/useGetIndexedDBData'

// https://stackoverflow.com/questions/66374123/warning-text-content-did-not-match-server-im-out-client-im-in-div/66374800#66374800
const FormAddTodo = dynamic(() => import('../components/FormAddTodo'), { ssr: false })

const initialMessagesState = {
    error: '',
    warning: ''
}

export default function Form(): JSX.Element {
    const [formInputValue, setFormInputValue] = useState('')
    const [todos, setTodos] = useState<Todo[]>([])
    const [messages, setMessages] = useState(initialMessagesState)

    useCreateIndexedDB()
    useGetIndexedDBData(setTodos)

    const formHandleButtonAddClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        event.preventDefault()

        if (!formInputValue.trim()) {
            setMessages({
                ...messages,
                warning: 'Do not permitted empty values.'
            })

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
    }

    const formHandleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setFormInputValue(event.target.value)
        setMessages(initialMessagesState)
    }

    const handleRemoveTodo = (id: string): void => {
        if (!confirm('Are you sure you want to remove this item?')) return

        setTodos(prev => prev.filter(todo => todo.id !== id))

        indexedDB.delete(id, setTodos)
    }

    const hanldeCheckTodo = (id: string): void => {
        const todoToUpdate = todos.find(todo => todo.id === id) as Todo
        todoToUpdate!.checked = !todoToUpdate.checked

        setTodos(prev => prev.map(todo => (todo.id === id ? { ...todoToUpdate } : todo)))

        setTimeout(() => {
            indexedDB.update(todoToUpdate)
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

    return (
        <div className="flex flex-col items-center justify-center bg-white dark:bg-[#222] w-7/12 drop-shadow-2xl p-8 rounded-md">
            {messages.warning}
            <FormAddTodo onChange={formHandleInputChange} onClick={formHandleButtonAddClick} value={formInputValue} />

            <div className={`${todos.length && 'mt-8'}`}>
                {todos.length ? <h1>Todos</h1> : null}
                <div>
                    {todos.map(todo => {
                        return (
                            <div key={todo.id} className="flex p-2 justify-between items-center">
                                <input
                                    onChange={() => hanldeCheckTodo(todo.id)}
                                    type="checkbox"
                                    name="checked"
                                    id="checked"
                                    checked={todo.checked}
                                />
                                <input
                                    className="flex-1 mx-8 px-1 border-2 border-gray-200 focus:outline-none focus:ring-1 focus:border-green-500"
                                    name="todo-edit"
                                    id="todo-edit"
                                    type="text"
                                    value={todo.name}
                                    placeholder={todo.name}
                                    onChange={e => handleEditTodo(e, todo.id)}
                                />
                                <button onClick={() => handleRemoveTodo(todo.id)}>
                                    <FaTrashAlt />
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
