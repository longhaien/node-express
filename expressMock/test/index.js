const expross = require('./../lib/expross');

const app = expross();

app.get('/', function (req, res) {
  res.send('hello world');
})

app.listen(3000, function (req, res) {
  console.log('create server listening 3000...');
});
