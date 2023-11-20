'use client'

import { PiSunDimFill } from 'react-icons/pi'
import { BiSolidMoon } from 'react-icons/bi'
import { useTheme } from 'next-themes'

const ThemeSwitch = (): JSX.Element => {
    const { theme, setTheme } = useTheme()

    const toggleTheme = (): void => {
        setTheme(theme === 'light' || theme === 'system' ? 'dark' : 'light')
    }

    const isActive = theme === 'light' || theme === 'system'

    const switchClasses = `flex items-center justify-center w-6 h-6 bg-white rounded-full transform ${
        isActive ? 'translate-x-0' : 'translate-x-6'
    } transition-transform duration-500 ease-in-out`

    return (
        <div
            className="flex items-center relative w-14 h-8 rounded-full p-1 cursor-pointer bg-[#ccc] dark:bg-blue-800 border-2 dark:border-gray-900 border-gray-400"
            onClick={toggleTheme}
        >
            <button className={switchClasses}>
                {isActive ? (
                    <PiSunDimFill className="text-yellow-500" size={16} />
                ) : (
                    <BiSolidMoon className="text-blue-800" />
                )}
            </button>
        </div>
    )
}

export default ThemeSwitch
