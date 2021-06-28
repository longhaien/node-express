const http = require('http');
const Router = require('./router');

function Application() {
  this._router = new Router();
}

Application.prototype.listen = function (...arguments) {
  var self = this;

  var server = http.createServer(function (req, res) {
    self.handle(req, res);
  })

  return server.listen.apply(server, arguments)
}

Application.prototype.handle = function (req, res) {
  if (!res.send) {
    res.send = function (body) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(body)
    }
  }

  var done = function finalhandler(err) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });

    if (err) {
      res.end('404:' + err);
    } else {
      var msg = 'Cannot ' + req.method + ' ' + req.url;
      res.end(msg);
    }
  }

  var router = this._router;
  router.handle(req, res, done);
}

http.METHODS.forEach(function (method) {
  method = method.toLowerCase();
  Application.prototype[method] = function (...arguments) {
    this._router[method].apply(this._router, arguments)
    return this;
  }
})


exports = module.exports = Application;

/* exports = module.exports = {
  _router: new Router(),

  get: function (path, fn) {
    return this._router.get(path, fn);
  },

  listen: function (...arguments) {
    var self = this;

    var server = http.createServer((req, res) => {
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
} */

/* function createApplication() {

  var router = [{
    path: '*',
    method: '*',
    handle: function (req, res) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('404');
    }
  }]

  return {
    get: function (path, handle) {
      console.log(`expross().get function`);
      router.push({ path, method: 'GET', handle })
    },
    listen: function (...arguments) {
      var server = http.createServer((req, res) => {

        console.log(`http.createServer...`);

        if (!res.send) {
          res.send = function (body) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(body)
          }
        }

        for (var i = 1, len = router.length; i < len; i++) {
          if ((req.url === router[i].path || router[i].path === '*') &&
            (req.method === router[i].method || router[i].method === '*')) {
            return router[i].handle && router[i].handle(req, res);
          }
        }

        return router[0].handle && router[0].handle(req, res);
      })

      return server.listen.apply(server, arguments);
    }
  };
}

exports = module.exports = createApplication; */