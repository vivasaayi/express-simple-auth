class Response {
  constructor(doneCB) {
    this.renderCalls = [];
    this.doneCB = doneCB;
  }

  send() {

  }

  render() {
    console.log("Render Invoked");
    this.renderCalls.push(arguments);

    if (this.doneCB) {
      this.doneCB(this.renderCalls);
    }
  }
}

module.exports = Response;