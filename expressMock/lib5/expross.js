var Application = require('./application');

function createApplication() {
  var app = new Application();
  return app;
}

/* const app = require('./application');

function createApplication() {
  return app;
} */

exports = module.exports = createApplication;