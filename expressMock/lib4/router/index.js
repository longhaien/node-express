const Layer = require('./layer');
const Route = require('./route');

var Router = function () {
  this.stack = [new Layer('*', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('404');
  })]
}

Router.prototype.handle = function (req, res) {
  var self = this, method = req.method;

  for (var i = 0, len = this.stack.length; i < len; i++) {
    const stackItem = this.stack[i];

    if (stackItem.match(req.url) &&
      (stackItem.route && stackItem.route._handles_method(method))) {
      return stackItem.handle_request(req, res);
    }
  }

  return this.stack[0].handle_request && this.stack[0].handle_request(req, res);
}

Router.prototype.route = function route(path) {
  var route = new Route(path);

  var layer = new Layer(path, function (req, res) {
    route.dispatch(req, res);
  })

  layer.route = route;
  this.stack.push(layer);

  return route;
}

Router.prototype.get = function (path, fn) {
  var route = this.route(path);
  route.get(fn);

  return this;
}

exports = module.exports = Router;