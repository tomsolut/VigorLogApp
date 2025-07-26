'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { logger } from '@/lib/logger';

export default function DebugPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'debug' | 'info' | 'warn' | 'error'>('all');

  useEffect(() => {
    // Lade Logs
    const allLogs = logger.getLogs();
    setLogs(allLogs);
  }, []);

  const exportLogs = () => {
    const data = logger.exportLogs();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vigorlog-debug-${new Date().toISOString()}.json`;
    a.click();
  };

  const clearLogs = () => {
    logger.clearLogs();
    setLogs([]);
  };

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.level === filter);

  const levelColors = {
    debug: 'bg-gray-100 text-gray-800',
    info: 'bg-blue-100 text-blue-800',
    warn: 'bg-orange-100 text-orange-800',
    error: 'bg-red-100 text-red-800'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle><i className="fa-solid fa-magnifying-glass mr-2"></i>VigorLog Debug Console</CardTitle>
            <div className="flex gap-2">
              <Button onClick={exportLogs} variant="outline" size="sm">
                Export Logs
              </Button>
              <Button onClick={clearLogs} variant="destructive" size="sm">
                Clear Logs
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            {(['all', 'debug', 'info', 'warn', 'error'] as const).map(level => (
              <Button
                key={level}
                variant={filter === level ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(level)}
              >
                {level.toUpperCase()}
                {level !== 'all' && (
                  <Badge variant="secondary" className="ml-2">
                    {logs.filter(log => log.level === level).length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Keine Logs vorhanden
              </p>
            ) : (
              filteredLogs.map((log, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border text-sm font-mono"
                >
                  <div className="flex items-start gap-2">
                    <Badge className={levelColors[log.level as keyof typeof levelColors]}>
                      {log.level}
                    </Badge>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{log.component}</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="font-medium">{log.message}</div>
                      {log.data && (
                        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}