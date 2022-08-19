const log4js = require('log4js');
const config = require('./config/globals');


log4js.configure({
    appenders: {
        consola: { type: 'console' },
        archivoErrores: { type: 'file', filename: 'error.log' },
        archivoWarning: { type: 'file', filename: 'warning.log' },
        loggerConsola: {
            type: 'logLevelFilter',
            appender: 'consola',
            level: 'info',
        },
        loggerArchivoWarning: {
            type: 'logLevelFilter',
            appender: 'archivoWarning',
            level: 'warn',
        },
        loggerArchivoErrores: {
            type: 'logLevelFilter',
            appender: 'archivoErrores',
            level: 'error',
        }
    },
    categories: {
        default: {
            appenders: ['loggerConsola'],
            level: 'all',
        },
        prod: {
            appenders: ['loggerConsola', 'loggerArchivoErrores', 'loggerArchivoWarning'],
            level: 'all',
        },
    },
})

let logger = null

if (config.NODE_ENV === 'production') {
    logger = log4js.getLogger('prod')
} else {
    logger = log4js.getLogger()
}


module.exports= logger;