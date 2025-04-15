
export interface SystemError {
  id: string;
  message: string;
  stack?: string;
  timestamp: Date;
  context: Record<string, any>;
  resolved: boolean;
  component?: string;
}
