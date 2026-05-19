const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const send = (level: 'info' | 'warn' | 'error', message: string, meta?: object) => {
  fetch(`${API_BASE_URL}/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ level, message, ...meta }),
  }).catch(() => {});
};

const logger = {
  info: (message: string, meta?: object) => send('info', message, meta),
  warn: (message: string, meta?: object) => send('warn', message, meta),
  error: (message: string, meta?: object) => send('error', message, meta),
};

export default logger;
