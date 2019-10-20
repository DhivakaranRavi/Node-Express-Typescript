import winston from 'winston';

// logger function
export function logger() {
  return winston.createLogger({
    transports: [
      new winston.transports.File({
        level: 'info',
        filename: './log/all-logs.log',
        handleExceptions: true,
        maxsize: 8242880, //8MB
        maxFiles: 5,
      }),
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.align(),
          winston.format.printf(info => {
            const { timestamp, level, message, ...args } = info;
            const ts = timestamp.slice(0, 19).replace('T', ' ');
            return `${ts} [${level}]: ${message} ${
              Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
            }`;
          }),
        ),
      }),
    ],
    exitOnError: false,
  });
}
