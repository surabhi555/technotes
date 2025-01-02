const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

// Asynchronous function to log events
const logEvents = async (message, logFileName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        const logDir = path.join(__dirname, '..', 'logs');

        // Check if the logs directory exists, create if not
        try {
            await fsPromises.access(logDir);
        } catch {
            await fsPromises.mkdir(logDir);
        }

        // Append the log item to the specified file
        await fsPromises.appendFile(path.join(logDir, logFileName), logItem);
    } catch (error) {
        console.error('Error logging event:', error);
    }
};

// Middleware function for logging HTTP requests
const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log');
    console.log(`${req.method} ${req.path}`);
    next();
};

module.exports = { logEvents, logger };
