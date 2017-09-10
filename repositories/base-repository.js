const _ = require("underscore");

const DataAccessWrapper = require("./data-access");
const objectId = require("mongodb").ObjectID;

const logger = require("../utils/logger");

class BaseRepository {
  executeQuery(query, params) {
    return DataAccessWrapper.executeQuery(query, params);
  }

  execureStoredProcedure(procedure, params) {
    return DataAccessWrapper.execureStoredProcedure(procedure, params);
  }

  buildWhereClause(clauses, paramIndex) {
    const result = " WHERE ";
    const conditions = [];

    let index = paramIndex;
    _.each(clauses, (clause) => {
      logger.log("CLAUSE", clause)
      const str = ` ${clause.table}."${clause.field}"${clause.condition}$${index} `;
      index += 1;
      conditions.push(str);
    });

    return result + conditions.join(" AND ");
  }

  buildSort(sortFields) {
    if (sortFields.lengh <= 0) {
      return "";
    }

    let result = "ORDER BY ";

    if (_.isArray(sortFields)) {
      result += `"`;
      result += sortFields.join(`","`);
      return result + `"`;
    }

    result = `ORDER BY `;

    const temp = [];
    _.each(_.keys(sortFields), key => {
      temp.push(`"${key}" ${sortFields[key]}`);
    });

    result += temp.join(",");
    return result;
  }

  save(collectionName, document, callback) {
    if (document._id) {
      document.updateOn = new Date(); // eslint-disable-line no-param-reassign
      return MongoWrapper.updateDocument(collectionName, document);
    }

    document._id = MongoWrapper.getObjectId(); // eslint-disable-line no-param-reassign
    document.addedOn = new Date();  // eslint-disable-line no-param-reassign
    return MongoWrapper.insertDocument(collectionName, document);
  }

  loadAll(collectionName) {
    return MongoWrapper.customQuery(collectionName, { query: {} });
  }

  loadById(collectionName, id) {
    const query = {
      _id: id,
    };

    return MongoWrapper.customQuery(collectionName, { query });
  }

  findAllByQuery(collectionName, query) {
    return MongoWrapper.customQuery(collectionName, { query });
  }

  customQuery(collectionName, query) {
    return MongoWrapper.customQuery(collectionName, { query });
  }

  customQueryWithConditions(collectionName, options) {
    return MongoWrapper.customQuery(collectionName, options);
  }

  delete(collectionName, document) {
    return MongoWrapper.deleteDocument(collectionName, document);
  }

  dropCollections(collections) {
    const promises = [];

    _.each(collections, (collection) => {
      promises.push(MongoWrapper.dropCollection(collection));
    });

    return Promise.all(promises);
  }
}

module.exports = BaseRepository;


// module.exports.delete = function (collectionName, document, callback) {
//   if (document._id) {
//     database.deleteDocument(collectionName, document, function (err, result) {
//       callback(err, result);
//     });
//   }
// };

// module.exports.loadSummary = function (collectionName, fields, callback) {
//   database.loadSelectedFields(collectionName, {}, fields, function (err, result) {
//     callback(err, result);
//   });
// };

// module.exports.loadAll = function (collectionName, callback) {
//   MongoWrapper.customQuery(collectionName, { query: {} })
//     .then(function (result) {
//       callback(null, result);
//     });
// };

// module.exports.loadById = function (collectionName, id, callback) {
//   var query = {
//     "_id": id
//   };

//   MongoWrapper.customQuery(collectionName, { query })
//     .then(function (result) {
//       callback(null, result);
//     });
// };

// module.exports.loadWithLimit = function (collectionName, limit, callback) {
//   console.log("Loading " + collectionName);
//   const query = {};

//   MongoWrapper.customQuery(collectionName, { query, limit })
//     .then((result) => {
//       callback(null, result);
//     });
// };

// module.exports.findAllByQuery = function (collectionName, query, callback) {
//   MongoWrapper.customQuery(collectionName, { query })
//     .then((result) => {
//       callback(null, result);
//     });
// };

// module.exports.findOneByQuery = function (collectionName, query, callback) {
//   MongoWrapper.findOneByQuery(collectionName, query)
//     .then(result => {
//       callback(null, result);
//     });
// };

// module.exports.customQueryV1 = function (collectionName, query, callback) {
//   MongoWrapper.customQuery(collectionName, query)
//     .then(function (results) {
//       callback(null, results);
//     });
// };

// module.exports.customQuery = function (collectionName, query, sort, limit, callback) {
//   var options = {
//     query: query,
//     sort: sort,
//     limit: limit
//   };

//   if (sort && limit) {
//     options.hint = "queryWithSortAndLimit";
//   }

//   database.customQuery(collectionName, query, function (err, result) {
//     callback(err, result);
//   });
// };

// module.exports.new = function (req, res) {
//   var employees = [
//     {
//       empNo: 500,
//       name: "Rajan",
//       active: true,
//       homeCode: "VLR"
//     },
//     {
//       empNo: 501,
//       name: "Rajan",
//       active: true,
//       homeCode: "VLR"
//     },
//     {
//       empNo: 502,
//       name: "Rajan",
//       active: true,
//       homeCode: "VLR"
//     }
//   ];

//   return employees;
// };
