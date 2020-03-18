import app from '../src/server/server';
import request from 'supertest';
import { create_user } from '../src/server/db';
import { resetDatabase } from '../scripts/reset_database.js';
import { loginUserFromCmdLine } from '../scripts/loginuser.js';
import * as auth from '../src/server/auth';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Promise from 'bluebird';

const expect = chai.expect;
chai.use(chaiAsPromised);

// make user create script to think that admin is doing all the thigns
function createUser(user) {
  return create_user(
    user.username,
    user.password,
    user.email
  ).catch(err => console.log(err));
}

const user1 = {
  username: 'pekka',
  email: 'pekka@example.fi',
  password: 'peKK@',
};

const testPhoto = {
  filename: 'testPhoto.jpg',
  ownername: 'Olli Omistaja',
  chattype: 'Group',
  chatname: 'Imagetty chat',
  created: '2345656',
  caption: 'This is a test photo.',
  visible: 1,
  chatid: -123,
  ownerid: 321,
};

describe('REST API - Photo', () => {
  describe('/api/photo', () => {
    before(() => resetDatabase()
      .then(() => createUser(user1))
      .catch(err => console.error(err))
    );

    it('Should allow to create photo as bot', () =>
      loginUserFromCmdLine('bot') // Login from cmdline, because bot has long random password created at db reset
        .then(token => request(app).post('/api/photo')
          .query({ accessToken: token.token })
          .send(testPhoto)
          .expect(200)
          .then(res => Promise.join(
            expect(res.body.id).to.not.be.null,
            expect(res.status).to.equal(200)
          )))

    );

    it('Should not allow to create photo as other user', () =>
      auth.loginUser({ username: user1.username, password: user1.password })
        .then(token => request(app).post('/api/photo')
          .query({ accessToken: token.token })
          .send(testPhoto)
          .expect(401))
    );

    it('Should not allow to create photo when not logged in', () =>
      request(app).post('/api/photo')
        .send(testPhoto)
        .expect(401)
    );
  });
});
