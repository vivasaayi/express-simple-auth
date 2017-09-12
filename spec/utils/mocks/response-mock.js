class Response {
  constructor(done) {
    this.renderCalls = [];
    this.done = done;
  }

  send() {

  }

  render() {
    this.renderCalls.push(arguments);

    if (this.done) {
      this.done();
    }
  }
}

module.exports = Response;