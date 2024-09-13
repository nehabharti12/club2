'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user-roles', 'userId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user-roles', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users', // Make sure this matches the table name
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  }
};
