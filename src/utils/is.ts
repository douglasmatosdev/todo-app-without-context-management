const is = {
    Array: (value: unknown): boolean => value!.constructor.name === 'Array',
    Object: (value: unknown): boolean => value!.constructor.name === 'Object'
}

export default is
