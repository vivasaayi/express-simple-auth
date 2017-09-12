class App {
  constructor() {
    this.calls = [];
  }
  use(args) {
    this.calls.push(args);
  }
}

module.exports = App;