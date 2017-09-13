const indexFile = require("../../index");

const Router = require("../utils/mocks/router-mock");
const App = require("../utils/mocks/app-mock");

xdescribe("express-simple-auth", () => {
  it("referring the package should not throw errors", () => {
    expect(indexFile).toBeDefined();
  });

  it("routes, logger & mail proxy should be exposed", () => {
    expect(indexFile.init).toBeDefined();
    expect(indexFile.logger).toBeDefined();
    expect(indexFile.mailProxy).toBeDefined();
  });

  it("should not fail when init method is called", () => {
    const router = new Router();
    const app = new App();

    indexFile.init(app, router);

    // ToDO: Assert
    expect(true).toBe(true);

    // console.log(app.calls);
    // console.log(router.calls);

    // console.log(JSON.stringify(router.calls));
  });
});