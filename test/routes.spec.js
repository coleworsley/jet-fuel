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
    // run migrations
    done();
  });

  beforeEach(done => {
    // run your seed file(s)
    server.locals.students = students;
    done();
  });
})
