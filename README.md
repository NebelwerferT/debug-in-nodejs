# RS School debug in Node.js

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## Database Connection

To connect the database, you need to modify the ./db.js file with the appropriate database name, username, and password. If necessary, you can change the port number for the database in the port: <number> field.

```
const sequelize = new Sequelize('dbname', 'username', 'password', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5433,
});
```

## Running application

```
npm start
```

After running the application on port (4000 by default), you can send requests to the server.

#### get:

- localhost:4000/api/game/all

- localhost:4000/api/game/:id

#### post:

- localhost:4000/api/auth/signup

- localhost:4000/api/auth/signin

- localhost:4000/api/game/create

#### put:

- localhost:4000/api/game/update/:id

#### delete:

- localhost:4000/api/game/remove/:id

## Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
