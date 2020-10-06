import express from 'express';
import { createUser, getUser, getUsers, isValidUser, User } from './user';

const bodyParser = require('body-parser');
const app: express.Application = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function (req: any, res: any) {
  res.send('Hello World!');
});

app.get('/users', function (request: any, response: any) {
    const users$ = getUsers();
    users$.subscribe(users => {
        response.send(users);
    })
});

app.get('/user', function (request: any, response: any) {
    const userId = request.query.id;

    if (userId && !isNaN(userId)) {
        const users$ = getUser(userId);
        users$.subscribe(user => {
            response.send(user);
        });
    } else {
        response.send({ error: 'ID is required.' });
    }
});

app.post('/user', function (request: any, response: any) {
    const newUser = request.body as User;

    if (isValidUser(newUser)) {
        const users$ = createUser(newUser);
        users$.subscribe(user => {
            response.send(user);
        });
    } else {
        response.send({ error: 'Invalid User' });
    }
});
  
app.listen(3000, function () {
  console.log('App is listening on port 3000!');
});