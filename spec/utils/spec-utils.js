const BaseRepository = require("../../src/repositories/base-repository");
const mailProxy = require("../../src/proxies/mail-proxy");

const baseRepository = new BaseRepository();

mailProxy.send = function () {
  return Promise.resolve();
};

function emptyTables() {
  return baseRepository.emptyTables(["users", "activation_links"]);
}

module.exports = {
  emptyTables
};
