const indexFile = require("../../index");

const Router = require("../utils/mocks/router-mock");
const App = require("../utils/mocks/app-mock");

const Request = require("../utils/mocks/request-mock");
const Response = require("../utils/mocks/response-mock");

const router = new Router();
const app = new App();

indexFile.init(app, router);

describe("express-simple-auth", () => {
  it("Calling Get Registration endpoint, should render the registration page", () => {
    const getRegistrationHandler = router.getObject("GET", "/register");

    const req = new Request();
    const res = new Response();

    getRegistrationHandler.fn1(req, res)

    expect(res.renderCalls.length).toBe(1);

    const args = res.renderCalls[0];

    expect(args[0]).toEqual("register");
    expect(args[1]).toEqual({ hideMenus: true });
  });

  it("Calling POST Registration endpoint, should throw validation errors", () => {
    const postRegistrationHandler = router.getObject("POST", "/register");

    function cb() {
      console.log("Completed");
      done();
    }

    const req = new Request(cb);
    const res = new Response();

    postRegistrationHandler.fn1(req, res)
  });
});