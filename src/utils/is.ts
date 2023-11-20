const is = {
    Array: (value: any): boolean => value.constructor.name === 'Array',
    Object: (value: any): boolean => value.constructor.name === 'Object'
}

export default is
