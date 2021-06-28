const expross = require('../');
const app = expross();


app.get('/', function (req, res, next) {
  res.send('hello expross');
  next();
}).get('/', function (req, res, next) {
  res.send('1111')
})

app.listen(3000, function (req, res) {
  console.log('create server listening http://127.0.0.1:3000')
});