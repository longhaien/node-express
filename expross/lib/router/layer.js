function Layer(path, fn) {
  this.handle = fn;
  this.name = fn.name || '<anonymous>';
  this.path = path;
}

// 错误处理
Layer.prototype.handle_error = function (error, req, res, next) {
  var fn = this.handle;

  if (fn.length !== 4) {
    return next(error);
  }

  try {
    fn(err, req, res, next);
  } catch (err) {
    next(err);
  }
}

// 正常处理函数
Layer.prototype.handle_request = function (req, res, next) {
  var fn = this.handle;

  try {
    fn(req, res, next);
  } catch (err) {
    next(err);
  }

}

Layer.prototype.match = function (path) {
  if (path === this.path || path === '*') { return true }
  return false;
}

exports = module.exports = Layer;