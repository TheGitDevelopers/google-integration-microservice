import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';

describe('Token route', () => {
  mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
  it('Should send JSON response with status code 200', async (done) => {
    await request(app)
      .get('/api/token')
      .expect(200)
      .expect('Content-Type', /json/, done);
  });
});
