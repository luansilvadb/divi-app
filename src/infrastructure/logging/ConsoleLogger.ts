import type { ILogger } from '../../core/logger/ILogger';

/**
 * Console-based implementation of ILogger.
 * Strictly adheres to Constitution Rule XIII.
 */
export class ConsoleLogger implements ILogger {
  private readonly context: string;

  constructor(context: string = 'App') {
    this.context = context;
  }

  private format(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${this.context}]: ${message}`;
  }

  public debug(message: string, ...args: any[]): void {
    console.debug(this.format('DEBUG', message), ...args);
  }

  public info(message: string, ...args: any[]): void {
    console.info(this.format('INFO', message), ...args);
  }

  public warn(message: string, ...args: any[]): void {
    console.warn(this.format('WARN', message), ...args);
  }

  public error(message: string, error?: Error, ...args: any[]): void {
    console.error(this.format('ERROR', message), error, ...args);
  }
}
