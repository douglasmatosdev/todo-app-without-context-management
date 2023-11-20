'use client'

type FormAddTodoProps = {
    value: string
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const FormAddTodo = (props: FormAddTodoProps): JSX.Element => {
    const { onClick, onChange, value } = props

    return (
        <form className="flex justify-between">
            <input
                className="border-2 border-gray-200 focus:outline-none focus:ring-1 focus:border-green-500 w-11/12 h-10 p-2 "
                name="todo"
                id="todo"
                type="text"
                value={value}
                placeholder="input some todo"
                onChange={onChange}
            />
            <button
                onClick={onClick}
                className="ml-8 border-green-600 border-2 w-16 h-10 rounded-md bg-green-500 text-white hover:bg-green-600"
            >
                Add
            </button>
        </form>
    )
}

export default FormAddTodo
