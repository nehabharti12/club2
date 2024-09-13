'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('comment', 'status', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      after: 'coachId', // Specifies the column after which the new column should be added
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('comment', 'status');
  }
};
