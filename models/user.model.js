
module.exports = (sequelize, Sequelize) => {
  
  const { INTEGER, STRING, FLOAT, BOOLEAN, DATE } = Sequelize;

  const User = sequelize.define("User", {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: STRING },
    name: { type: STRING },
    surname: { type: STRING },
    phone: { type: STRING },
    address1: { type: STRING },
    postcode: { type: STRING },
    passwordHash: {type: STRING}
  });

  return User;
};

