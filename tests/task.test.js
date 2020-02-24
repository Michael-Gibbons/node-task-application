const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const {
  userOneId, 
  userOne, 
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should create task for user', async (done) => {
  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "randomTaskDescription"
    })
    .expect(201)

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
  done();
});

test('Should only return tasks created by user', async (done) => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200)
  expect(response.body.length).toEqual(2)
  done();
});

test('Should not delete other user\'s tasks', async (done) => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .expect(404)
  const task = Task.findById(taskOne._id);
  expect(task).not.toBeNull();
  done();
});