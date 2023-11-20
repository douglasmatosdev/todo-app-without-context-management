'use client'

import indexedDB from '@/database/indexedDB'
import { checkIfIndexedDBAlreadyExists } from '@/utils/checkIfIndexedDBAlreadyExists'
import { useEffect } from 'react'

export async function useCreateIndexedDB(): Promise<void> {
    useEffect(() => {
        async function start(): Promise<void> {
            const alreadyExists = await checkIfIndexedDBAlreadyExists()

            if (!alreadyExists) {
                indexedDB.createIndexedDb()
            }
        }
        start()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
}
