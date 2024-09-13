'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the columns from the 'club' table
    await queryInterface.removeColumn('club', 'emailAddress');
    await queryInterface.removeColumn('club', 'password');
    await queryInterface.removeColumn('club', 'role');
  },

  down: async (queryInterface, Sequelize) => {
    // Re-add the columns to the 'club' table in case of rollback
    await queryInterface.addColumn('club', 'emailAddress', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('club', 'password', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('club', 'role', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};
