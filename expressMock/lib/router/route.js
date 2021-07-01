const http = require('http');
const Layer = require('./layer');

function Route(path) {
  this.path = path;
  this.stack = [];

  this.methods = {};
}

Route.prototype._handles_method = function (method) {
  var name = method.toLowerCase();
  return Boolean(this.methods[name]);
}

Route.prototype.dispatch = function (req, res) {
  var self = this, method = req.method.toLowerCase();

  for (var i = 0; i < self.stack.length; i++) {
    var stackItem = self.stack[i];
    if (stackItem.method === method) {
      stackItem.handle_request(req, res);
    }
  }
}

http.METHODS.forEach(function (method) {
  method = method.toLowerCase();
  Route.prototype[method] = function (fn) {
    var layer = new Layer('/', fn);
    layer.method = method;

    this.methods[method] = true;
    this.stack.push(layer);
  }
})

exports = module.exports = Route;