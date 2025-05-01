
// Error handling types

export enum ErrorLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export enum ErrorContext {
  UI = 'ui',
  API = 'api',
  DATABASE = 'database',
  SYNC = 'sync',
  AUTHENTICATION = 'authentication',
  UNKNOWN = 'unknown'
}
