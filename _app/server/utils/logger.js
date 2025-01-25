const winston = require("winston");

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    debug: "blue",
  },
  fileName: {
    error: "error.log",
    warn: "warn.log",
    info: "info.log",
    debug: "debug.log",
  },
};

const NOW = () => new Date().toISOString().split("T")[0];

const logger = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      ({ timestamp, level, message }) => `\n ${timestamp} ${level}: \n ${message}`
    )
  ),
  transports: [
    new winston.transports.Console(), // Log to the console
    new winston.transports.File({
      filename: "_logs/" + NOW() + "/" + customLevels.fileName.error,
      level: "error",
    }),
    new winston.transports.File({
      filename: "_logs/" + NOW() + "/" + customLevels.fileName.warn,
      level: "warn",
    }),
    new winston.transports.File({
      filename: "_logs/" + NOW() + "/" + customLevels.fileName.info,
      level: "info",
    }),
    new winston.transports.File({
      filename: "_logs/" + NOW() + "/" + customLevels.fileName.debug,
      level: "debug",
    }),
  ],
});

module.exports = logger;
