import * as admin from 'firebase-admin';
import * as readline from 'readline';
import * as serviceAccount from './.firebase/admin-sdk.json';
import { generateFixtures } from '../src/app/fixtures/fixture-generator';

const listAllUsers = async () => {
  try {
    // List batch of users, 1000 at a time.
    const listUsersResult = await admin.auth().listUsers();
    listUsersResult.users.forEach(userRecord => {
      console.log('user', userRecord.toJSON());
    });
  } catch (error) {
    console.log('Error listing users:', error);
  }
};

export const runAdminConsole = () => {
  // const loader = new FixtureLoader(this.fixtureFilePath);
  // loader.load();
  // const editor = new FixtureEditor(this.fixtureFilePath, loader.fixtures, loader.getNextMatchNumber());

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: 'https://awesome-league-manager.firebaseio.com'
  });

  const rl = readline.createInterface(process.stdin, process.stdout);
  rl.setPrompt('Enter match: ');
  rl.prompt();
  rl.on('line', async (line: string) => {
    const parts = line.split(' ');
    switch (parts[0]) {
      case 'exit':
        rl.close();
        break;
      case 'list':
        await listAllUsers();
        break;
      case 'add-user':
        const x = await admin.auth().createUser({ displayName: parts[1], email: parts[2] });
        console.log(x);
        break;
      case 'delete-user':
        try {
          const user = await admin.auth().getUserByEmail(parts[1]);
          await admin.auth().deleteUser(user.uid);
          console.log('user deleted');
        } catch (error) {
          console.error(error);
        }
        break;
      default:
        break;
    }
    // const values = line.split(',');
    // editor.finalizeMatch(values[0], values[1], Number.parseInt(values[2], 10), Number.parseInt(values[3], 10));
    // editor.save();
    rl.prompt();
  }).on('close', () => {
    process.exit(0);
  });
};
