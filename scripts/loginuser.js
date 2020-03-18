import { createAccesstoken } from '../src/server/auth';
import * as db from '../src/server/db';

/*
 * Login user from commandline, or from test script without knowing the password
 */

export function loginUserFromCmdLine(uname) {
  return db.findUser({ username: uname })
    .then(user => {
      if (user) {
        return createAccesstoken(user, 10000000);
      } else {
        return new Error('User not found.');
      }
    });
}

if (require.main === module) {
  const username = process.argv[2];

  loginUserFromCmdLine(username)
    .then(at => console.log(`User: ${ username }, Token: ${ at }`))
    .catch(err => console.error(`Something went wrong, perhaps the user "${ username }" does not exist.`, err));
}
