const express = require('express');
const mongo = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const shortid = require('shortid');

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$&');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extends: true,
}));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

mongo.connect(process.env.CONNECT_STRING, (error, client) => {
  if (error) throw error;
  const urlsDB = client.db('freecodecamp-services').collection('urls');
  const counterDB = client.db('freecodecamp-services').collection('counter');
  console.log('Database connected'); //eslint-disable-line
});

app.get('/short', (request, response) => {
  response.send('Yay, It works');
});
app.listen(process.env.PORT || 3000);
