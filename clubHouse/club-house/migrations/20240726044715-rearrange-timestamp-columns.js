'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Temporarily drop the createdAt and updatedAt columns
      await queryInterface.removeColumn('users', 'createdAt', { transaction });
      await queryInterface.removeColumn('users', 'updatedAt', { transaction });

      // Re-add the createdAt and updatedAt columns at the end
      await queryInterface.addColumn('users', 'createdAt', {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }, { transaction });

      await queryInterface.addColumn('users', 'updatedAt', {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      }, { transaction });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Temporarily drop the createdAt and updatedAt columns
      await queryInterface.removeColumn('users', 'createdAt', { transaction });
      await queryInterface.removeColumn('users', 'updatedAt', { transaction });

      // Re-add the createdAt and updatedAt columns at their original positions
      await queryInterface.addColumn('users', 'createdAt', {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }, { transaction });

      await queryInterface.addColumn('users', 'updatedAt', {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      }, { transaction });
    });
  }
};
