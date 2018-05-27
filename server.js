const express = require('express');
const mongo = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const shortid = require('shortid');

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$&');
const app = express();

function checkURL(url) {
  const regForUrl = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  return (regForUrl.test(url));
}


app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extends: true,
}));

app.get('/', (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});

app.get('/short/:url(*)', (request, response) => {
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
      } else if (checkURL(url)) {
        const short = shortid.generate();
        const newDocument = {
          url,
          short,
        };
        urlsDB.insert([newDocument], (errorInsert) => {
          if (errorInsert) {
            console.log('Insertion error'); //eslint-disable-line
          } else {
            client.close();
          }
        });
        response.json({
          original_url: url,
          short_url: process.env.HOST + short,
        });
      } else {
        response.sendFile(`${__dirname}/views/error.html`);
      }
    });
  });
});

app.get('/error', (request, response) => {
  response.sendFile(`${__dirname}/views/error.html`);
});

app.get('/:short', (request, response) => {
  mongo.connect(process.env.CONNECT_STRING, (error, client) => {
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

// Respond not found to all the wrong routes
app.use((req, res) => {
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use((err, req, res) => {
  if (err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }
});

app.listen(process.env.PORT || 3000);
