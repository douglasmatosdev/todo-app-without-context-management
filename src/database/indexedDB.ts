'use client'
import { IndexedDBSettings } from '@/utils/constants'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
const idb = // @ts-expect-error
    window?.indexedDB || window?.mozIndexedDB || window?.webkitIndexedDB || window?.msIndexedDB || window?.shimIndexedDB

const createIndexedDb = (): void => {
    // check for support
    if (!idb) {
        console.log("This browser doesn't support IndexedDB")

        return
    }

    const request = idb.open(IndexedDBSettings.name, IndexedDBSettings.version)

    request.onerror = function (event) {
        console.error('An error occurred with IndexedDB')
        console.error(event)
    }

    request.onupgradeneeded = function () {
        const db = request.result

        if (!db.objectStoreNames.contains(IndexedDBSettings.talbe)) {
            const objectStore = db.createObjectStore(IndexedDBSettings.talbe, {
                keyPath: IndexedDBSettings.index as string
            })

            objectStore.createIndex(IndexedDBSettings.index, IndexedDBSettings.index, {
                unique: false
            })
        }
    }
}

const save = (todo: Todo): void => {
    const dbPromise = idb.open(IndexedDBSettings.name, IndexedDBSettings.version)

    dbPromise.onsuccess = () => {
        const db = dbPromise.result

        const tx = db.transaction('todos', 'readwrite')
        const todosData = tx.objectStore('todos')

        const todos = todosData.put({ ...todo })

        todos.onsuccess = () => {
            tx.oncomplete = function () {
                db.close()
            }
            alert('Todo added!')
        }
    }
}

const getAll = (set: React.Dispatch<React.SetStateAction<Todo[]>>): void => {
    const dbPromise = idb.open(IndexedDBSettings.name, IndexedDBSettings.version)

    dbPromise.onsuccess = () => {
        const db = dbPromise.result

        const tx = db.transaction(IndexedDBSettings.talbe, 'readonly')
        const todosData = tx.objectStore(IndexedDBSettings.talbe)
        const todos = todosData.getAll()

        todos.onsuccess = query => {
            set((query.target as EventTarget & { result: Todo[] })?.result)
        }

        tx.oncomplete = function () {
            db.close()
        }
    }
}

const deleteTodo = (id: string, set: React.Dispatch<React.SetStateAction<Todo[]>>): void => {
    const dbPromise = idb.open(IndexedDBSettings.name, IndexedDBSettings.version)

    dbPromise.onsuccess = function () {
        const db = dbPromise.result
        const tx = db.transaction(IndexedDBSettings.talbe, 'readwrite')
        const todosData = tx.objectStore(IndexedDBSettings.talbe)
        const deletesTodo = todosData.delete(id)

        deletesTodo.onsuccess = () => {
            tx.oncomplete = function () {
                db.close()
            }
            getAll(set)
        }
    }
}

const update = (todo: Todo): void => {
    const dbPromise = idb.open(IndexedDBSettings.name, IndexedDBSettings.version)

    dbPromise.onsuccess = () => {
        const db = dbPromise.result

        const tx = db.transaction('todos', 'readwrite')
        const todosData = tx.objectStore('todos')

        const todos = todosData.put({ ...todo })

        todos.onsuccess = () => {
            tx.oncomplete = function () {
                db.close()
            }
            // alert('Todo updated!')
        }
    }
}

const indexedDB = { save, createIndexedDb, getAll, delete: deleteTodo, update }

export default indexedDB
