const { DataTypes } = require("sequelize");
const sequelize = require("../services/db");
const User = require("./userModel");
const Coach = require("./coachModel");
const Club = require("./clubModel"); // Import the Club model

const UserRole = sequelize.define(
  "UserRole",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    roleName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "user-roles",
    timestamps: true,
  }
);
sequelize
  .sync()
  .then(() => {
    console.log("UserRole table has been created.");
  })
  .catch((error) => {
    console.error("Unable to role create table : ", error);
  });

module.exports = UserRole;
