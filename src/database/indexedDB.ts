'use client'
import { IndexedDBSettings } from '@/utils/constants'
import is from '@/utils/is'

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

        if (!db.objectStoreNames.contains(IndexedDBSettings.tableTodos)) {
            const objectStore = db.createObjectStore(IndexedDBSettings.tableTodos, {
                keyPath: IndexedDBSettings.todosIndex as string
            })

            objectStore.createIndex(IndexedDBSettings.todosIndex, IndexedDBSettings.todosIndex, {
                unique: false
            })
        }

        if (!db.objectStoreNames.contains(IndexedDBSettings.tableCheckeAll)) {
            const objectStore = db.createObjectStore(IndexedDBSettings.tableCheckeAll, {
                keyPath: IndexedDBSettings.checkedAllIndex as string
            })

            objectStore.createIndex(IndexedDBSettings.checkedAllIndex, IndexedDBSettings.checkedAllIndex, {
                unique: false
            })
        }
    }
}

const save = (todo: Todo): void => {
    const dbPromise = idb.open(IndexedDBSettings.name, IndexedDBSettings.version)

    dbPromise.onsuccess = () => {
        const db = dbPromise.result

        const tx = db.transaction(IndexedDBSettings.tableTodos, 'readwrite')
        const todosData = tx.objectStore(IndexedDBSettings.tableTodos)

        const todos = todosData.put({ ...todo })

        todos.onsuccess = () => {
            tx.oncomplete = function () {
                db.close()
            }
        }
    }
}

const getAll = (set: React.Dispatch<React.SetStateAction<Todo[]>>): void => {
    const dbPromise = idb.open(IndexedDBSettings.name, IndexedDBSettings.version)

    dbPromise.onsuccess = () => {
        const db = dbPromise.result

        const tx = db.transaction(IndexedDBSettings.tableTodos, 'readonly')
        const todosData = tx.objectStore(IndexedDBSettings.tableTodos)
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
        const tx = db.transaction(IndexedDBSettings.tableTodos, 'readwrite')
        const todosData = tx.objectStore(IndexedDBSettings.tableTodos)
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

        const tx = db.transaction(IndexedDBSettings.tableTodos, 'readwrite')
        const todosData = tx.objectStore(IndexedDBSettings.tableTodos)

        const todos = todosData.put({ ...todo })

        todos.onsuccess = () => {
            tx.oncomplete = function () {
                db.close()
            }
        }
    }
}

const checkedAll = (value: { isCheckedAll: boolean; disabled: boolean }): void => {
    const dbPromise = idb.open(IndexedDBSettings.name, IndexedDBSettings.version)

    dbPromise.onsuccess = () => {
        const db = dbPromise.result

        const tx = db.transaction(IndexedDBSettings.tableCheckeAll, 'readwrite')
        const checkedAllData = tx.objectStore(IndexedDBSettings.tableCheckeAll)

        const todos = checkedAllData.put({
            ...value,
            [IndexedDBSettings.checkedAllIndex]: IndexedDBSettings.checkedAllIndex
        })

        todos.onsuccess = () => {
            tx.oncomplete = function () {
                db.close()
            }
        }
    }
}

const getCheckedAll = (
    set: React.Dispatch<
        React.SetStateAction<{
            isCheckedAll: boolean
            disabled: boolean
        }>
    >,
    initialState: CheckedAll
): void => {
    const dbPromise = idb.open(IndexedDBSettings.name, IndexedDBSettings.version)

    dbPromise.onsuccess = () => {
        const db = dbPromise.result

        const tx = db.transaction(IndexedDBSettings.tableCheckeAll, 'readonly')
        const checkedAllData = tx.objectStore(IndexedDBSettings.tableCheckeAll)
        const checkedAll = checkedAllData.getAll()

        checkedAll.onsuccess = query => {
            const result = (
                query.target as EventTarget & {
                    result: CheckedAll
                }
            )?.result

            const value = is.Object(result)
                ? result
                : is.Array(result)
                  ? (result as unknown as CheckedAll[])[0]
                  : initialState

            set(value)
        }

        tx.oncomplete = function () {
            db.close()
        }
    }
}

export const deleteDatabase = (databaseName: string): void => {
    idb.deleteDatabase(databaseName)
}

const indexedDB = {
    save,
    createIndexedDb,
    getAll,
    delete: deleteTodo,
    update,
    checkedAll,
    getCheckedAll,
    deleteDatabase
}

export default indexedDB
