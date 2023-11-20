'use client'
import dynamic from 'next/dynamic'

// https://stackoverflow.com/questions/66374123/warning-text-content-did-not-match-server-im-out-client-im-in-div/66374800#66374800
const ThemeSwitch = dynamic(() => import('../components/ThemeSwitch'), { ssr: false })
const Form = dynamic(() => import('../components/Form'), { ssr: false })

export default function Home(): JSX.Element {
    return (
        <main className="flex min-h-screen flex-col bg-gray-200 dark:bg-gray-700">
            <section className="grid w-full p-8 ">
                <div className="justify-self-end">
                    <ThemeSwitch />
                </div>
            </section>
            <section className="flex flex-col items-center w-full mt-3.5 mb-auto">
                <Form />
            </section>
        </main>
    )
}
