const winston = require('winston');
const { format, transports } = winston;

module.exports = (appname) => {
    winston.loggers.add('default', {
        level: 'info',
        levels: Object.assign({ 'fatal': 0, 'warn': 4, 'trace': 7 }, winston.config.syslog.levels),
        format: format.combine(format.splat(), format.json()),
        defaultMeta: { service: appname + "_" + (process.env.NODE_ENV || "development") },
        transports: [
            new transports.File({ filename: `log/${new Date().toLocaleDateString()}.log` }),
        ]
    });

    let logger = winston.loggers.get("default");

    if (process.env.NODE_ENV !== 'production') {
        logger.add(new transports.Console({
            format: format.simple(),
            handleExceptions: true
        }));
    }

    process.on('uncaughtException', function (err) {
        console.log("UncaughtException processing: %s", err);
    });

    logger.child = function () { return winston.loggers.get("default") };

    return logger
}