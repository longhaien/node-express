const http = require('http');
const Router = require('./router');

function Application() {
  this._router = new Router();
}

Application.prototype.listen = function (port, cb) {
  const self = this;

  const server = http.createServer(function (req, res) {
    if (!res.send) {
      res.send = function (body) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(body);
      }
    }

    return self._router.handle(req, res);
  })

  return server.listen.apply(server, arguments);
}

http.METHODS.forEach(function (method) {
  method = method.toLowerCase();
  Application.prototype[method] = function (path, fn) {
    this._router[method].apply(this._router, arguments);
    return this;
  }
})

exports = module.exports = Application