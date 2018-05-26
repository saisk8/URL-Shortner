const express = require('express');
const mongo = require('mongodb').MongoClient;
const btoa = require('btoa');
const atob = require('atob');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extends: true,
}));

mongo.connect(process.env.CONNECT_STRING, (error, client) => {
  if (error) throw error;
  const urlsDB = client.db('freecodecamp-services').collection('urls');
  const counterDB = client.db('freecodecamp-services').collection('counter');
  console.log('Database connected'); //eslint-disable-line
});

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});
app.get('/short', (request, response) => {
  response.send('Yay, It works');
});
app.listen(process.env.PORT || 3000);
