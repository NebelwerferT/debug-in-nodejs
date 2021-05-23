const Sequelize = require('sequelize');
//database username password
const sequelize = new Sequelize('gamedb', 'postgres', 'password', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5433,
});

sequelize.authenticate().then(
    () => { console.log("Connected to DB"); },
    (err) => { console.log(`Error: ${err}`); },
);

module.exports = sequelize;