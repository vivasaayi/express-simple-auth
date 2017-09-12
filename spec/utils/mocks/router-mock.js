const _ = require("underscore");

class Router {
  constructor() {
    this.calls = [];
  }

  get(path, fn1, fn2, fn3) {
    this.calls.push({
      method: "GET",
      path,
      fn1,
      fn2,
      fn3
    });
  }

  post(path, fn1, fn2, fn3) {
    this.calls.push({
      method: "POST",
      path,
      fn1,
      fn2,
      fn3
    });
  }

  getObject(method, url) {
    const endpoint = _.find(this.calls, call => {
      return call.method === method && call.path === url;
    });

    return endpoint;
  }
}

module.exports = Router;