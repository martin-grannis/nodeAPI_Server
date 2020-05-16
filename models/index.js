
const dbConfig = require("../config/index.js");

const Sequelize = require("sequelize");
//const sqlite = require("sqlite");

const sequelize = new Sequelize( {
  //host: dbConfig.HOST,
  storage: dbConfig.DATABASE_NAME,
  dialect: dbConfig.DATABASE_DIALECT,
  

  // pool: {
  //   max: dbConfig.pool.max,
  //   min: dbConfig.pool.min,
  //   acquire: dbConfig.pool.acquire, 
  //   idle: dbConfig.pool.idle
  // }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.userModel = require("./user.model.js")(sequelize, Sequelize);

//  test the sqlite connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = db;
