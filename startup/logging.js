const winston = require("winston");
require("winston-mongodb");

module.exports = function () {
  //handling uncaught exceptions: things that go wrong outside express
  // process.on('uncaughtException', (ex) => {
  //     winston.error(ex.message, ex);
  //     process.exit(1);
  // });

  //handling unhandled promise rejections: things that go wrong outside express
  // process.on('unhandledRejection', (ex) => {
  //     winston.error(ex.message, ex);
  //     process.exit(1);
  // });

//   winston.handleExceptions(
//     new winston.transports.File({ filename: "uncaughtExceptions.log" })
//   );

  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  winston.add(
    new winston.transports.MongoDB({
      db: "mongodb://localhost/vidly",
      level: "info",
    })
  );
};
