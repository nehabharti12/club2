'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'uuid', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4 ,
      after: 'createdAt'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'uuid');
  }
};
