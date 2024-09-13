'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('VideoUpload', 'VideoUpload_ibfk_2');

    await queryInterface.dropTable('Coach');
  },

  down: async (queryInterface, Sequelize) => {
    // Recreate the `Coach` table
    await queryInterface.createTable('Coach', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // Add other columns for the Coach table as needed
    });

    // Re-add the foreign key constraint on the `VideoUpload` table
    await queryInterface.addConstraint('VideoUpload', {
      fields: ['uploadedFor'],
      type: 'foreign key',
      name: 'VideoUpload_ibfk_2',
      references: {
        table: 'Coach',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
};
