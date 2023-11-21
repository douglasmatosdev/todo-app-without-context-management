'use client'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa6'

// https://stackoverflow.com/questions/66374123/warning-text-content-did-not-match-server-im-out-client-im-in-div/66374800#66374800
const ThemeSwitch = dynamic(() => import('../components/ThemeSwitch'), { ssr: false })
const Form = dynamic(() => import('../components/Form'), { ssr: false })

export default function Home(): JSX.Element {
    return (
        <main className="flex items-center min-h-screen flex-col bg-gray-50 dark:bg-gray-700">
            <section className="grid w-10/12 md:w-7/12 max-w-5xl py-8 grid-cols-2">
                <div className="justify-self-start flex justify-center items-center">
                    <Link href="/">
                        <Image src="/icon-192x192.png" alt="todo logo" width={55} height={55} />
                    </Link>
                </div>

                <div className="justify-self-end flex justify-center items-center">
                    <ThemeSwitch />
                </div>
            </section>

            <section className="flex flex-col items-center w-full mb-auto">
                <Form />
            </section>

            <footer className="w-full flex flex-col items-center justify-center bg-zinc-100 py-4 mt-8">
                <span className="text-gray-600">
                    Developed by <i className="text-gray-500">Douglas Matos da Silva, {new Date().getFullYear()}</i>
                </span>
                <Link
                    title="Github link"
                    className="flex items-center text-blue-500 underline"
                    href="https://github.com/douglasmatosdev"
                >
                    <FaGithub className="mr-2" /> Github douglasmatosdev
                </Link>
            </footer>
        </main>
    )
}
