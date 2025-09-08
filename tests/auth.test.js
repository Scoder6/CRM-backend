const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const { connectDatabase } = require('../config/database');
const User = require('../models/User');

describe('Auth Controller', () => {
  beforeAll(async () => {
    process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crmdb_test';
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
    process.env.JWT_EXPIRE = '1h';
    process.env.NODE_ENV = 'test';
    await connectDatabase();
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test('registers a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Alice', email: 'alice@example.com', password: 'password123' })
      .expect(201);
    expect(res.body.user).toMatchObject({ name: 'Alice', email: 'alice@example.com', role: 'User' });
    expect(res.body.user.id).toBeDefined();
  });

  test('logs in a user and returns token', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Bob', email: 'bob@example.com', password: 'password123' })
      .expect(201);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bob@example.com', password: 'password123' })
      .expect(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('bob@example.com');
  });
});

