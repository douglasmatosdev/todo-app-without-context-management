import './globals.css'
import 'react-toastify/dist/ReactToastify.css'

import type { Metadata } from 'next'
import ThemeProvider from '@/providers/themeProvider'

import { ToastContainer } from 'react-toastify'

export const metadata: Metadata = {
    title: 'Todo',
    description: 'Simple todo application'
}

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        // use suppressHydrationWarning={true} to avoid Warning: Extra attributes from the server: class,style
        // becouse ThemeProvider has attribute="class"
        <html lang="en" suppressHydrationWarning={true}>
            <body>
                <ToastContainer />
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}
