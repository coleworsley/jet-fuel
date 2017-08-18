const knex = require('../knex');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage with text', (done) => {
    chai.request(server)
    .get('/')
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.html;
      done();
    })
  })
})


describe('API Routes', () => {
  before(done => {
    knex.migrate.rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      done();
    })
  });

  beforeEach(done => {
    knex.seed.run()
    .then(() => {
      done();
    })
  });

  describe('GET /api/v1/folders', () => {
    it('should return all folders', (done) => {
      chai.request(server)
      .get('/api/v1/folders')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.equal(3);
        res.body[0].should.have.property('id');
        res.body[0].id.should.equal(1);
        res.body[0].should.have.property('name');
        res.body[0].name.should.equal('Concerts');
        done();
      });
    });
  });

  describe('POST /api/v1/folders', () => {
    it('should create a new folder', (done) => {
      chai.request(server)
      .post('/api/v1/folders')
      .send({
        id: 4,
        name: 'Subreddits',
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('number');
        res.body.should.equal(4);

        chai.request(server)
        .get('/api/v1/folders')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array')
          res.body.length.should.equal(4);
          res.body[3].should.have.property('id');
          res.body[3].id.should.equal(4);
          res.body[3].should.have.property('name');
          res.body[3].name.should.equal('Subreddits');
          done();
        });
      });
    });
  });

  describe('GET /api/v1/folders/:id/links', () => {
    it('should get all the links in a folder', (done) => {
      chai.request(server)
      .get('/api/v1/folders/1/links')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.equal(2);
        done();
      });
    });
  });
});
