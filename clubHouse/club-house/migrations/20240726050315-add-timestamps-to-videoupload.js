'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Update createdAt column
      await queryInterface.changeColumn('VideoUpload', 'createdAt', {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }, { transaction });

      // Update updatedAt column
      await queryInterface.changeColumn('VideoUpload', 'updatedAt', {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }, { transaction });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Revert createdAt column
      await queryInterface.changeColumn('VideoUpload', 'createdAt', {
        allowNull: false,
        type: Sequelize.DATE
      }, { transaction });

      // Revert updatedAt column
      await queryInterface.changeColumn('VideoUpload', 'updatedAt', {
        allowNull: false,
        type: Sequelize.DATE
      }, { transaction });
    });
  }
};
