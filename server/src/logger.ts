import winston from 'winston';
import Transport from 'winston-transport';
import net from 'net';

const LOGSTASH_HOST = process.env.LOGSTASH_HOST || 'localhost';
const LOGSTASH_PORT = parseInt(process.env.LOGSTASH_PORT || '5044');

class LogstashTCPTransport extends Transport {
  private client: net.Socket;

  constructor(opts: { host: string; port: number } & Transport.TransportStreamOptions) {
    super(opts);
    this.client = net.createConnection(opts.port, opts.host);
    this.client.on('connect', () => console.log('[Logstash] Connecté'));
    this.client.on('error', (err) => console.error('[Logstash] Erreur TCP:', err.message));
  }

  log(info: unknown, callback: () => void) {
    setImmediate(() => this.emit('logged', info));
    this.client.write(JSON.stringify(info) + '\n');
    callback();
  }
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const extras = Object.keys(meta).length ? ' ' + JSON.stringify(meta) : '';
          return `[${timestamp}] ${level}: ${message}${extras}`;
        })
      ),
    }),
    new LogstashTCPTransport({ host: LOGSTASH_HOST, port: LOGSTASH_PORT }),
  ],
});

export default logger;
