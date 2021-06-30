var Router = function () {
  this.stack = [{
    path: '*',
    method: '*',
    handle: function (req, res) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('404');
    }
  }]
}

Router.prototype.get = function (path, fn) {
  this.stack.push({
    path,
    method: 'GET',
    handle: fn
  })
}

Router.prototype.handle = function (req, res) {
  for (var i = 1, len = this.stack.length; i < len; i++) {
    const stackItem = this.stack[i];
    if ((req.url === stackItem.path || stackItem.path === '*') &&
      (req.method === stackItem.method || stackItem.method === '*')) {
      return stackItem.handle && stackItem.handle(req, res);
    }
  }

  return this.stack[0].handle && this.stack[0].handle(req, res);
}

exports = module.exports = Router;