// VigorLog - Debug Logger
// Hilft bei der Fehleridentifikation während der Entwicklung

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  component: string;
  message: string;
  data?: any;
  stack?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private isDevelopment = typeof window !== 'undefined' ? window.location.hostname === 'localhost' : process.env.NODE_ENV === 'development';

  private log(level: LogLevel, component: string, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      component,
      message,
      data
    };

    // Stack trace für Errors
    if (level === 'error' && typeof Error !== 'undefined') {
      try {
        entry.stack = new Error().stack;
      } catch (e) {
        // Ignore stack trace errors
      }
    }

    // Speichere im Array
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output mit Farben
    const styles = {
      debug: 'color: #888; font-weight: normal;',
      info: 'color: #2563eb; font-weight: normal;',
      warn: 'color: #f59e0b; font-weight: bold;',
      error: 'color: #ef4444; font-weight: bold;'
    };

    const prefix = `[${entry.timestamp.split('T')[1].split('.')[0]}] [${component}]`;
    
    if (this.isDevelopment) {
      console.log(`%c${prefix} ${message}`, styles[level], data || '');
      
      if (level === 'error' && entry.stack) {
        console.error('Stack trace:', entry.stack);
      }
    }

    // Speichere kritische Logs im localStorage
    if ((level === 'error' || level === 'warn') && typeof window !== 'undefined' && window.localStorage) {
      try {
        const storedLogs = localStorage.getItem('vigorlog_debug_logs');
        const logs = storedLogs ? JSON.parse(storedLogs) : [];
        logs.push(entry);
        
        // Behalte nur die letzten 100 kritischen Logs
        if (logs.length > 100) {
          logs.splice(0, logs.length - 100);
        }
        
        localStorage.setItem('vigorlog_debug_logs', JSON.stringify(logs));
      } catch (e) {
        console.error('Failed to store log:', e);
      }
    }
  }

  debug(component: string, message: string, data?: any) {
    this.log('debug', component, message, data);
  }

  info(component: string, message: string, data?: any) {
    this.log('info', component, message, data);
  }

  warn(component: string, message: string, data?: any) {
    this.log('warn', component, message, data);
  }

  error(component: string, message: string, data?: any) {
    this.log('error', component, message, data);
  }

  // Hole alle Logs
  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  // Lösche alle Logs
  clearLogs() {
    this.logs = [];
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem('vigorlog_debug_logs');
      } catch (e) {
        console.error('Failed to clear stored logs:', e);
      }
    }
  }

  // Exportiere Logs als JSON
  exportLogs(): string {
    const data = {
      exported: new Date().toISOString(),
      environment: {
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A',
        url: typeof window !== 'undefined' ? window.location.href : 'N/A',
        viewport: typeof window !== 'undefined' ? {
          width: window.innerWidth,
          height: window.innerHeight
        } : 'N/A'
      },
      logs: this.logs
    };
    return JSON.stringify(data, null, 2);
  }
}

// Singleton Instance
export const logger = new Logger();

// Globaler Error Handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    logger.error('Global', `Unhandled error: ${event.message}`, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Global', `Unhandled promise rejection`, {
      reason: event.reason
    });
  });
}

// Debug-Konsole für Entwicklung
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  (window as any).vigorlogDebug = {
    getLogs: () => logger.getLogs(),
    getErrors: () => logger.getLogs('error'),
    exportLogs: () => logger.exportLogs(),
    clearLogs: () => logger.clearLogs()
  };
  
  console.log('%c[DEBUG] VigorLog Debug Mode Active', 'color: #39FF14; font-weight: bold;');
  console.log('Use window.vigorlogDebug to access debug tools');
}