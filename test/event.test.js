import request from 'supertest';
import app from '../src/app';

describe('Event route', () => {
  it('Should send JSON response with status code 200', (done) => {
    request(app)
      .get('/api/events')
      .expect(200)
      .expect('Content-Type', /json/, done);
  });
});
