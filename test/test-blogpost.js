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
});