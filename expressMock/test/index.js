const expross = require('./../lib/expross');

const app = expross();

app.get('/', function (req, res) {
  res.send('get hello world');
})
app.put('/', function (req, res) {
  res.send('put hello world');
})

app.listen(3000, function (req, res) {
  console.log('create server listening 3000...');
});
