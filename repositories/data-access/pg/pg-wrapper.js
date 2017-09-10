const Promise = require("bluebird");
const pgp = require('pg-promise')();

const logger = require("../../../utils/logger");

// create a config to configure both pooling behavior 
// and client options 
// note: all config is optional and the environment variables 
// will be read if the config is not present 
const config = {
  user: "postgres", // env var: PGUSER 
  database: "swapcents", // env var: PGDATABASE 
  password: "root", // env var: PGPASSWORD 
  host: "localhost", // Server hosting the postgres database 
  port: 5432, // env var: PGPORT 
  max: 10, // max number of clients in the pool 
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed 
};

// this initializes a connection pool 
// it will keep idle connections open for 30 seconds 
// and set a limit of maximum 10 idle clients 
const db = pgp(config);

class PGWrapper {
  static executeQuery(query, params) {
    logger.log("ExecuteQuery Start:", query);

    const startTime = new Date();
    return db.any(query, params)
      .then((data) => {
        logger.log("ExecuteQuery Completed:", query, ":", new Date() - startTime, "ms");
        return data;
      })
      .catch((error) => {
        logger.log("ExecuteQuery:Error:", error);
        return error;
      });
  }

  static execureStoredProcedure(procedure, params) {
    logger.log("ExecureStoredProcedure Start:", procedure);

    const startTime = new Date();
    return db.func(procedure, params)
      .then((data) => {
        logger.log("ExecureStoredProcedure:", procedure, ":", new Date() - startTime, "ms");
        return data;
      })
      .catch((error) => {
        logger.log("ExecureStoredProcedure:Error:", error);
        return error;
      });
  }
}

module.exports = PGWrapper;
