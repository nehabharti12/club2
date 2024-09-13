'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'firstName', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    });
    await queryInterface.changeColumn('users', 'username', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    });
    await queryInterface.changeColumn('users', 'userType', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    });
    await queryInterface.changeColumn('users', 'lastName', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    });
    await queryInterface.changeColumn('users', 'emailAddress', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    });
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    });
    await queryInterface.changeColumn('users', 'uuid', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    });
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the changes (optional)
    await queryInterface.changeColumn('users', 'firstName', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "User"
    });
    await queryInterface.changeColumn('users', 'username', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "User"
    });
    await queryInterface.changeColumn('users', 'userType', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "1"
    });
    await queryInterface.changeColumn('users', 'lastName', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: "User"
    });
    await queryInterface.changeColumn('users', 'emailAddress', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.changeColumn('users', 'uuid', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4
    });
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.STRING,
      allowNull: true
      // No defaultValue to revert to previous state
    });
  }
};
