'use client'

import indexedDB from '@/database/indexedDB'
import { checkIfIndexedDBAlreadyExists } from '@/utils/checkIfIndexedDBAlreadyExists'
import { useEffect } from 'react'

export function useGetIndexedDBTodoData(set: React.Dispatch<React.SetStateAction<Todo[]>>): void {
    useEffect(() => {
        async function start(): Promise<void> {
            if (await checkIfIndexedDBAlreadyExists()) {
                indexedDB.getAll(set)
            }
        }
        start()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}

export function useGetIndexedDBCheckedAllData(
    set: React.Dispatch<React.SetStateAction<CheckedAll>>,
    initialState: CheckedAll
): void {
    useEffect(() => {
        async function start(): Promise<void> {
            if (await checkIfIndexedDBAlreadyExists()) {
                indexedDB.getCheckedAll(set, initialState)
            }
        }
        start()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}
