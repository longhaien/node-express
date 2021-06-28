// 层级
/* 
router (layer)
  - path
  - route (layer)
    - method
    - handle function
*/

const Layer = require('./layer');
const Route = require('./route');

const http = require('http');

var Router = function () {
  /* this.stack = [new Layer('*', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('404');
  })]; */
  this.stack = [];
}

Router.prototype.handle = function (req, res, done) {
  var self = this,
    method = req.method,
    idx = 0, stack = self.stack;

  function next(err) {
    var layerError = (err === 'route' ? null : err);

    // 跳过路由系统
    if (layerError === 'router') {
      return done(null);
    }

    if (idx >= stack.length || layerError) {
      return done(layerError)
    }

    var layer = stack[idx++];
    if (layer.match(req.url) && layer.route && layer.route._handles_method(method)) {
      return layer.handle_request(req, res, next);
    } else {
      next(layerError);
    }
  }

  next();

  /* 
  for (var i = 1, len = self.stack.length; i < len; i++) {
    const stackItem = self.stack[i];
    if (stackItem.match(req.url) &&
      stackItem.route && stackItem.route._handles_method(method)) {
      return stackItem.handle_request(req, res);
    }
  } 

  return self.stack[0].handle_request(req, res);
  */
}

// 生成route
Router.prototype.route = function route(path) {
  var route = new Route(path);
  var layer = new Layer(path, route.dispatch.bind(route));
  layer.route = route;
  this.stack.push(layer);

  return route;
}

/* Router.prototype.get = function (path, fn) {
  var route = this.route(path);
  route.get(fn);

  return this;
} */

http.METHODS.forEach(function (method) {
  method = method.toLowerCase();
  Router.prototype[method] = function (path, fn) {
    var route = this.route(path);
    route[method].call(route, fn);

    return this;
  }
})

exports = module.exports = Router;