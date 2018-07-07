const express = require('express');
const morgan = require('morgan');

const app = express();

const blogpostRouter = require('./blogpostRouter');

// log http layer
app.use(morgan('common'));
// if we wanted html we can change to express.static('public')
app.use(express.json());

app.use('/blog-posts', blogpostRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});