import request from 'supertest';
import app from '../src/app';

describe('Token route', () => {
  it('Should send JSON response with status code 200', (done) => {
    request(app)
      .get('/api/token')
      .expect(200)
      .expect('Content-Type', /json/, done);
  });
});
