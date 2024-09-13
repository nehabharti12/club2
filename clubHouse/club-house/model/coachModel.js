const { DataTypes } = require('sequelize');
const sequelize = require('../services/db');
const Club = require('./clubModel');
const user = require('./userModel');

const Coach = sequelize.define('Coach', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  emailAddress: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phoneNo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role:{
    type: DataTypes.STRING,
    defaultValue: "COACH"
  },
 
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'coaches',
  timestamps: true

});

// Club.hasMany(Coach, { foreignKey: 'clubId' });
// Coach.belongsTo(Club, { foreignKey: 'clubId' });
user.hasMany(Coach, { foreignKey: 'userId' });
Coach.belongsTo(user, { foreignKey: 'clubxxxxId' });

sequelize.sync()
  .then(() => {
    console.log('All tables have been created.');
  })
  .catch((error) => {
    console.error('Unable to create tables: ', error);
  });

module.exports = Coach;
