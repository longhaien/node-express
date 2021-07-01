const Layer = require('./layer');

var Router = function () {
  this.stack = [new Layer('*', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('404');
  })]
}

Router.prototype.handle = function (req, res) {
  for (var i = 1, len = this.stack.length; i < len; i++) {
    const stackItem = this.stack[i];

    if (stackItem.match(req.url)) {
      return stackItem.handle_request(req, res);
    }
  }

  return this.stack[0].handle_request && this.stack[0].handle_request(req, res);
}

Router.prototype.get = function (path, fn) {
  this.stack.push(new Layer(path, fn))
}

exports = module.exports = Router;