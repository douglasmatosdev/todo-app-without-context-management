'use client'
import indexedDB from '@/database/indexedDB'
import { IndexedDBSettings } from '@/utils/constants'
import { useToastify } from '@/utils/useToastify'
import { FaTrashAlt } from 'react-icons/fa'
import { FaCodePullRequest, FaDatabase, FaPlus } from 'react-icons/fa6'

type FormAddTodoProps = {
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
    value: string
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    loadTodosFromApi: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    message: {
        messages: {
            error: string
            warning: string
        }
        setMessages: React.Dispatch<
            React.SetStateAction<{
                error: string
                warning: string
            }>
        >
        initialMessagesState: {
            error: string
            warning: string
        }
    }
}

const FormAddTodo = (props: FormAddTodoProps): JSX.Element => {
    const { onClick, onChange, value, message, loadTodosFromApi, setTodos } = props
    const { toast } = useToastify()

    return (
        <form className="flex justify-between w-full flex-wrap-reverse md:flex-nowrap">
            <input
                className={`border-2 ${
                    message.messages.warning ? 'border-red-600' : 'border-gray-200'
                } focus:outline-none focus:ring-1 mt-4 md:mt-0 focus:border-green-500 w-full md:w-11/12 h-10 p-2`}
                name="todo"
                id="todo"
                type="text"
                value={value}
                placeholder="input some todo"
                onChange={onChange}
                onFocus={() => message.setMessages(message.initialMessagesState)}
                title="todo description"
            />
            <button
                title="add new todo"
                onClick={onClick}
                className="flex flex-1 md:flex-none justify-center items-center md:ml-2 border-green-600 border-2 w-12 h-10 rounded-md bg-green-500 text-zinc-50 hover:bg-green-600"
            >
                <FaPlus />
            </button>

            <button
                title="import todos list"
                onClick={loadTodosFromApi}
                className="flex flex-1 md:flex-none mx-4 md:mx-0 justify-center items-center md:ml-1 border-green-600 border-2 w-12 h-10 rounded-md bg-blue-400 text-zinc-50 hover:bg-blue-600"
            >
                <FaCodePullRequest />
            </button>

            <button
                title="delete database"
                onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                    event.preventDefault()
                    if (!confirm('Are you sure you want to DELETE database?')) return

                    indexedDB.deleteDatabase(IndexedDBSettings.name)
                    setTodos([])
                    toast('database deleted successfuly', 'info')
                }}
                className="flex flex-1 md:flex-none justify-center items-center md:ml-1 border-red-600 border-2 w-12 h-10 rounded-md bg-red-400 text-zinc-50 hover:bg-red-600"
            >
                <div className="delete-database">
                    <FaDatabase className="database-icon text-fuchsia-200" />
                    <FaTrashAlt className="trash-icon text-gray-800" />
                </div>
            </button>
        </form>
    )
}

export default FormAddTodo
