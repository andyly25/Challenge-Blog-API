const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');
const expect = chai.expect;

// allows make http req in tests
chai.use(chaiHttp);

describe('Blog posts', function () {
  // activate our server before tests run
  before(function () {
    return runServer();
  });

  // after tests end we closeServer
  after(function () {
    return closeServer();
  });

  // GET: make request to /blog-posts
  it('should list items on GET', function () {
    return chai
      .request(app)
      .get('/blog-posts')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.be.above(0);
        // check if contain key/value pairs
        // for ['title', 'content', 'author', 'publishDate', 'id']
        const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
        res.body.forEach(function (item) {
          expect(item).to.be.a('object');
          expect(item).include.keys(expectedKeys);
        });
      })
  });

  // POST: make a post with data for new item
  // inspect res and prove has right status code and data
  it('should add an item on POST', function () {
    // ['title', 'content', 'author', 'publishDate']
    const newItem = {title: 'The Light', content: 'going into the light', author: 'Anon', publishDate: 2018};
    return chai
      .request(app)
      .post('/blog-posts')
      .send(newItem)
      .then(function (res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
        expect(res.body.id).to.not.equal(null);
        // res should be deep equal to newItem if assign id from res.body.id
        expect(res.body).to.deep.equal(
          Object.assign(newItem, { id: res.body.id })
        );
      });
  });

  // init some update data
  // make a GET req so we can get item to update
  // add id to update data
  // inspect res to make sure right status code and get back correct item
  it('should update items on PUT', function () {
    const updateData = {
      title: 'Sleep Deprivation',
      content: 'How to get a good night\'s sleep',
      author: 'Sandman',
      publishDate: '1600'
    };

    return (
      chai
        .request(app)
        .get('/blog-posts')
        .then(function (res) {
          updateData.id = res.body[0].id;
          // return a promise whose value be res obj, inspeced in next .then
          return chai
            .request(app)
            .put(`/blog-posts/${updateData.id}`)
            .send(updateData);
        })
        // prove PUT has right status then return updated item
        .then(function (res) {
          expect(res).to.have.status(204);
        })
    );
  });

});
