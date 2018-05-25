const express = require('express');
const mongo = require('mongodb').MongoClient;
const btoa = require('btoa');
const atob = require('atob');
const bodyParser = require('body-parser');

const app = express();

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extends: true,
}));

mongo.connect(process.env.CONNECT_STRING, (error, client) => {
  if (error) throw error;
  const urlsDB = client.db('freecodecamp-services').collection('urls');
  const counterDB = client.db('freecodecamp-services').collection('counter');
});
app.get('/', (req, res) => {
  res.render('index');
});

app.listen(process.env.PORT || 3000);
