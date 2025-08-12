const request = require('supertest');
const app = require('../src/app');

describe('URL shortener', () => {
  it('rejects invalid URL', async () => {
    const response = await request(app)
      .post('/api/shorten')
      .send({ url: 'not-a-url' });
    expect(response.status).toBe(400);
  });

  it('creates a short URL', async () => {
    const response = await request(app)
      .post('/api/shorten')
      .send({ url: 'https://example.com' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('shortUrl');
  });

  it('redirects from short id to original URL', async () => {
    const create = await request(app)
      .post('/api/shorten')
      .send({ url: 'https://example.com/abc' });
    const { id } = create.body;
    const res = await request(app).get(`/${id}`).redirects(0);
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('https://example.com/abc');
  });
});

