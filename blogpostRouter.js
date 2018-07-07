const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

// Let's add in some data so GET will give us something to work with
// note blogpost takes in title, content, author, publishDate
BlogPosts.create(
  'Life', 
  'Life gives you lemons so you make squirt juice at life\'s eyes and say hah!',
  'Billy Bob',
  '2018'
);

BlogPosts.create(
  'Boredom', 
  'Slayer of mankind, impetus for advancing civilization',
  'Silly Sue',
  '2022'
);

// send back JSON representation of all blogposts
// on GET requests to root
router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

// Now for our POST for when new blogposts gets added
// make sure has required field and return 400 status code if error
// if okay, adds in the new item with 201
router.post('/', jsonParser, (req, res) => {
  // note blogpost takes in title, content, author, publishDate
  const requiredFields = ['title', 'content', 'author', 'publishDate'];
  for (let i = 0; i < requiredFields.length; i += 1) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = BlogPosts.create(req.body.title, req.body.content, 
                                req.body.author, req.body.publishDate);
  res.status(201).json(item);
});

// DELETE by id
router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post item \`${req.params.ID}\``);
  res.status(204).end();
});

// PUT request comes in with updated blog post
// ensure has required fields and has blog id
// if any errors, log it and send back status code 400
// otherwise call BlogPosts.update 
router.put('/:id', jsonParser, (req, res) => {
  // note blogpost takes in title, content, author, publishDate
  // borrowed parts from POST and added in id at end
  const requiredFields = ['title', 'content', 'author', 'publishDate', 'id'];
  for (let i = 0; i < requiredFields.length; i += 1) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post item \`${req.params.id}\``);
  const updatedTerm = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate
  });
  res.status(204).end();
});

module.exports = router;
