const config = require('../knexfile')['test'];
const knex = require('knex')(config);
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
    .then(() => done())
  });

  beforeEach(done => {
    knex.seed.run()
    .then(() => done())
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

    it('should return an error if the parameters are not met', (done) => {
      chai.request(server)
      .post('/api/v1/folders')
      .send({
        id: 4,
        folder: 'this should\'t work',
      })
      .end((err, res) => {
        res.should.have.status(422);
        res.body.should.equal('Missing required parameter name');
        done();
      })
    })

  it('should return an error if there\'s a duplication', (done) => {
    const name = 'Duplication';

    chai.request(server)
    .post('/api/v1/folders')
    .send({
      name,
      id: 5
    })
    .end((err, res) => {
      res.should.have.status(201);
      res.body.should.be.a('number');

      chai.request(server)
      .post('/api/v1/folders')
      .send({
        name,
        id: 6
      })
      .end((err, res) => {
        res.should.have.status(409)
        res.body.detail.should.equal('Key (name)=(Duplication) already exists.')
        done();
      })
    })
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
        res.body[0].should.have.property('id');
        res.body[0].id.should.equal(1);
        res.body[0].should.have.property('original_url');
        res.body[0].original_url.should.equal('http://www.ticketmaster.com/section/concerts');
        res.body[0].should.have.property('short_url');
        res.body[0].short_url.should.equal('placeholder');
        res.body[0].should.have.property('folder_id');
        res.body[0].folder_id.should.equal(1);
        done();
      });
    });
  });

  describe('POST /api/v1/folders/:id/links', () => {
    it('should post a link to a folder', (done) => {
      chai.request(server)
      .post('/api/v1/folders/1/links')
      .send({
        id: 7,
        original_url: 'https://www.rottentomatoes.com/',
        short_url: 'placeholder',
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('number');
        res.body.should.equal(7);

        chai.request(server)
        .get('/api/v1/folders/1/links')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.equal(3);
          res.body[2].should.have.property('id');
          res.body[2].id.should.equal(7);
          res.body[2].should.have.property('original_url');
          res.body[2].original_url.should.equal('https://www.rottentomatoes.com/');
          res.body[2].should.have.property('short_url');
          res.body[2].short_url.should.equal('placeholder');
          res.body[2].should.have.property('folder_id');
          res.body[2].folder_id.should.equal(1);
          done();
        });
      });
    });
  });

  describe('GET /api/v1/links/:id', () => {
    it('should redirect to the original url', (done) => {
      chai.request(server)
      .get('/api/v1/links/3')
      .end((err, res) => {
        res.should.have.status(200);
        res.type.should.equal('text/html');
        res.redirects[0].should.equal('https://developer.mozilla.org/en-US/')
        done();
      })
    });
  });
});
