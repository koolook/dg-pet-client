export type ErrorSeverity = 'normal' | 'fatal'

export type ApplicationError = {
  severity: ErrorSeverity
  message: string
}
