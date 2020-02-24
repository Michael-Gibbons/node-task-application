const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const {userOneId, userOne, setupDatabase} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should sign up a new user', async (done) => {
  const response = await request(app).post('/users').send({
    name: "Michael Gibbons",
    email: "michael@example.com",
    password: "MyPass777!"
  }).expect(201);

  // Asserting that the database was updated correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assertions about response

  expect(response.body).toMatchObject({
    user:{
      name: "Michael Gibbons",
      email: "michael@example.com",   
    },
    token: user.tokens[0].token
  });

  expect(user.password).not.toBe('MyPass777!');

  done();
});

test('Should log in existing user', async (done) => {
  const response = await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  }).expect(200);

  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);

  done();
});

test('Should not log in non-existant user', async (done) => {
  await request(app).post('/users/login').send({
    email: 'randomNonexistantEmail',
    password: 'randomNonexistantPassword'
  }).expect(400);
  done();
});

test('Should get profile for user', async (done) => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  done();
});

test('Should not get profile for unauthenticated user', async (done) => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer RandomInvalidToken`)
    .send()
    .expect(401);
  done();
});

test('Should delete account for authenticated user', async (done) => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

    const user = await User.findById(userOneId);
    expect(user).toBeNull();
  done();
});

test('Should not delete account for unauthenticated user', async (done) => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer RandomInvalidToken`)
    .send()
    .expect(401);
  done();
});

test('Should upload avatar image', async (done) => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/cat.jpg')
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
  done();
});

test('Should update valid user fields', async (done) => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: "RandomDifferentName"
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toBe("RandomDifferentName");
  done();
});

test('Should not update invalid user fields', async (done) => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      randomInvalidParameter: "RandomDifferentvalue"
    })
    .expect(400);
  done();
});

