export function asString(error: unknown) {
  if (error instanceof Error) {
    return error.message
  } else if (typeof error === 'string') {
    return error as string
  } else {
    return 'Unknown error'
  }
}
