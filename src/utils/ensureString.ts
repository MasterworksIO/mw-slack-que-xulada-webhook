export default function ensureString(
  condition: unknown,
  message: string | (() => string) = 'Not a string',
): asserts condition is string {
  if (typeof condition === 'string' && condition) {
    return
  }

  const value = typeof message === 'function' ? message() : message

  throw new TypeError(value)
}
