const http = require('http');

function createApplication() {

  var router = [{
    path: '*',
    method: '*',
    handle: function (req, res) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('404');
    }
  }]

  return {
    get: function (path, fn) {
      console.log('expross().get function')
      router.push({
        path,
        method: 'GET',
        handle: fn
      });
    },
    listen: function (port, cb) {
      console.log('expross().listen function')

      const server = http.createServer(function (req, res) {
        console.log('http.createServer...');

        if (!res.send) {
          res.send = function (body) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(body);
          }
        }

        for (var i = 1, len = router.length; i < len; i++) {
          const routerItem = router[i];

          if ((req.url === routerItem.path || routerItem.path === '*') &&
            (req.method === routerItem.method || routerItem.method === '*')) {

            return routerItem.handle(req, res);
          }
        }

        return router[0].handle && router[0].handle(req, res);
      })

      // return server.listen(port, cb);
      return server.listen.apply(server, arguments);
    }

  }
}

exports = module.exports = createApplication;