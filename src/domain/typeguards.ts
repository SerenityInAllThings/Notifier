export type ValidationError = {
  message: string
  property: string
}

export const validateObject = (value: unknown): string | undefined => {
  if (value == null) return 'Null or undefined'
  if (typeof value !== 'object') return 'Not an object'
  return undefined
}

export const isObject = (value: unknown): value is object => validateObject(value) === undefined

export const validateNumericProperty = <T extends string>(value: object, propName: T): string | undefined => {
  if (!(propName in value)) return 'Missing value'
  //@ts-expect-error propName exists in value, but typescript is dumb
  const propValue: unknown = value[propName]
  if (typeof propValue !== 'number') return 'Not a number'
  return undefined
}

export const hasNumericProperty = <T extends string>(value: object, propName: T): value is Record<T, number> =>
  validateNumericProperty(value, propName) === undefined

export const validateStringProperty = <T extends string>(
  value: object,
  propName: T,
  errorOnEmptyValue = true,
  minimumLength: number | undefined = undefined,
  maximumLength: number | undefined = undefined
): string | undefined => {
  if (!(propName in value)) return 'Missing value'
  //@ts-expect-error propName exists in value, but typescript is dumb
  const propValue: unknown = value[propName]
  if (typeof propValue !== 'string') return 'Not a string'
  if (errorOnEmptyValue && propValue.length === 0) return 'Empty value'
  if (minimumLength !== undefined && propValue.length < minimumLength)
    return `Value is shorter than ${minimumLength} characters`
  if (maximumLength !== undefined && propValue.length > maximumLength)
    return `Value is longer than ${maximumLength} characters`
  return undefined
}

export const hasStringProperty = <T extends string>(
  value: object,
  propName: T,
  errorOnEmptyValue = true,
  minimumLength: number | undefined = undefined,
  maximumLength: number | undefined = undefined
): value is Record<T, string> =>
  validateStringProperty(value, propName, errorOnEmptyValue, minimumLength, maximumLength) === undefined

export const validateEmailProperty = <T extends string>(
  value: object,
  propName: T,
  errorOnEmptyValue = true,
  minimumLength: number | undefined = undefined,
  maximumLength: number | undefined = undefined
): string | undefined => {
  if (!hasStringProperty(value, propName, errorOnEmptyValue, minimumLength, maximumLength))
    return validateStringProperty(value, propName, errorOnEmptyValue, minimumLength, maximumLength)
  return validateEmail(value[propName])
}

export const validateStringArrayProperty = <T extends string>(value: object, propName: T): string | undefined => {
  if (!(propName in value)) `Missing '${propName}'`
  //@ts-expect-error propName exists in value, but typescript is dumb
  const propValue: unknown = value[propName]
  if (!Array.isArray(propValue)) return 'Not an array'
  if (!propValue.every(innerArrayValue => typeof innerArrayValue === 'string')) return 'Not an array of strings'
  return undefined
}

export const hasStringArrayProperty = <T extends string>(value: object, propName: T): value is Record<T, string[]> =>
  validateStringArrayProperty(value, propName) === undefined

export const validateEmail = (email: string): string | undefined => {
  if (!email.includes('@')) return 'Missing @'
  const parts = email.split('@')
  if (parts.length !== 2) return 'Too many @'
  if (!parts[0].length) return 'Missing username'
  if (!parts[1].length) return 'Missing domain'
  if (!email.includes('.')) return 'Missing . in domain'
  return undefined
}

export const validateStringLiteralProperty = <T extends string>(
  value: object,
  propName: T,
  allowedValues: readonly string[]
): string | undefined => {
  if (!(propName in value)) return `Missing '${propName}'`
  //@ts-expect-error propName exists in value, but typescript is dumb
  const valueOfPropName: unknown = value[propName]
  if (typeof valueOfPropName !== 'string') return 'Not a string'
  if (!allowedValues.includes(valueOfPropName)) return `Value must be one of ${allowedValues.join(', ')}`
}

export const hasStringLiteralProperty = <T extends string>(
  value: object,
  propName: T,
  allowedValues: readonly string[]
): value is Record<T, string> => validateStringLiteralProperty(value, propName, allowedValues) === undefined

export const validateStringToStringMapProperty = <T extends string>(value: object, propName: T): string | undefined => {
  if (!isObject(value)) return 'Not an object'
  if (!(propName in value)) return `Missing prop '${propName}'`
  //@ts-expect-error keys exist in value, but typescript is dumb
  const possibleMap = value[propName]
  if (!isObject(possibleMap)) return `${propName} is not an object`
  const keys = Object.keys(possibleMap)
  if (keys.some(key => typeof key !== 'string')) return 'Not all keys are strings'
  //@ts-expect-error keys exist in value, but typescript is dumb
  if (keys.some(key => typeof possibleMap[key] !== 'string')) return 'Not all values are strings'
  return undefined
}

export const hasStringToStringMapProperty = <T extends string>(
  value: object,
  prop: T
): value is Record<T, Record<string, string>> => validateStringToStringMapProperty(value, prop) === undefined
