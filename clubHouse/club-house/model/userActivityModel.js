const { DataTypes } = require('sequelize');
const sequelize = require('../services/db');

const UserActivity = sequelize.define('UserActivity',
  {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ip: {
    type: DataTypes.STRING
  },
  location: {
    type: DataTypes.STRING
  },
  os: {
    type: DataTypes.STRING
  },
  browser: {
    type: DataTypes.STRING
  },
  platform: {
    type: DataTypes.STRING
  },
  method: {
    type: DataTypes.STRING
  },
  version: {
    type: DataTypes.STRING
  },
  route: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.INTEGER
  },
  time: {
    type: DataTypes.DATE
  },
  processTime: {
    type: DataTypes.STRING
  },
  requestObject: {
    type: DataTypes.JSON
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'tbl_user_activities',
  timestamps: true
});

sequelize.sync()
    .then(() => {
        console.log('User table has been created.');
    })
    .catch((error) => {
        console.error('Unable to create table : ', error);
    });

module.exports = UserActivity;
