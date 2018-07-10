const express = require('express');
const morgan = require('morgan');

const app = express();
const blogpostRouter = require('./blogpostRouter');

// log http layer
app.use(morgan('common'));
// if we wanted css and etc we can change to express.static('public')
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.use('/blog-posts', blogpostRouter);

// both runServer and closeServer access same server obj
let server;

// This func starts our server and returns a promise.
function runServer () {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app
      .listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve(server);
      })
      .on('error', err => {
        reject(err);
      });
  });
}

// this function also returns a promise and server.close does not return 
// a promist on its own.
function closeServer () {
  return new Promise((resolve, reject) => {
    console.log('closing server');
    server.close(err => {
      if(err) {
        reject(err);
        // so we dont call resolve()
        return;
      }
      resolve();
    });
  });
}

// if server.js is called directly, this block runs
// also export runServer so other code can start the server as well
if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer}