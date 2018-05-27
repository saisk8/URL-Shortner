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

app.get('/', (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});

app.post('/short/:url(*)', (request, response) => {
  mongo.connect(process.env.CONNECT_STRING, (error, client) => {
    if (error) throw error;
    const urlsDB = client.db('freecodecamp-services').collection('urls');
    console.log('Database connected'); //eslint-disable-line
    const {
      url,
    } = request.params;
    urlsDB.findOne({
      url,
    }, {
      short: 1,
      _id: 0,
    }, (err, doc) => {
      if (doc != null) {
        response.json({
          original_url: url,
          short_url: process.env.HOST + doc.short,
        });
      } else {
        const short = shortid.generate();
        const newDocument = {
          url,
          short,
        };
        urlsDB.insert([newDocument]);
        response.json({
          original_url: url,
          short_url: process.env.HOST + short,
        });
      }
    });
    client.close();
  });
});

app.get('/error', (request, response) => {
  response.sendFile(`${__dirname}/views/error.html`);
});

app.get('/:short', (request, response) => {
  mongo.client(process.env.CONNECT_STRING, (error, client) => {
    if (error) throw error;
    const urlsDB = client.db('freecodecamp-services').collection('urls');
    console.log('Database connected'); //eslint-disable-line
    const {
      short,
    } = request.params;
    urlsDB.findOne({
      short,
    }, {
      url: 1,
      _id: 0,
    }, (err, doc) => {
      if (doc != null) {
        response.redirect(doc.url);
      } else {
        response.json({
          error: 'Short link not found',
        });
      }
    });
    client.close();
  });
});

app.listen(process.env.PORT || 3000);
