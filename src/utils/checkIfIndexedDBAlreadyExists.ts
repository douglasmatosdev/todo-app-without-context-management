'use client'
import { IndexedDBSettings } from './constants'

export async function checkIfIndexedDBAlreadyExists(): Promise<boolean> {
    return (await window?.indexedDB.databases()).map(db => db.name).includes(IndexedDBSettings.name)
}
