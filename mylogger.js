var winston = require('winston');
const MESSAGE = Symbol.for('message');
const jsonFormatter = (logEntry) => {
    const base = { timestamp: new Date() };
    const json = Object.assign(base, logEntry);
    logEntry[MESSAGE] = JSON.stringify(json);
    return logEntry;
}
const logger = winston.createLogger({
    level: 'info',
    format: winston.format(jsonFormatter)(),
    transports: new winston.transports.Console(),
});
//winston logger manager
class myLogger{
    constructor(){

    }
    info(arr, band){
        logger.info(arr, { "band": band });
    }
    error(err){
        logger.error(err)
    }
}
module.exports = myLogger