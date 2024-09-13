const { DataTypes } = require("sequelize");
const sequelize = require("../services/db");

const UserClub = sequelize.define(
  "UserClub",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    clubId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "club",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
  },
  {
    tableName: "user_club",
  }
);

sequelize
  .sync()
  .then(() => {
    console.log("User-Club table has been created.");
  })
  .catch((error) => {
    console.error("Unable to create User-Club table: ", error);
  });

module.exports = UserClub;
