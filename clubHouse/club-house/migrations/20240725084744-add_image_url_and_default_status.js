'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('VideoUpload', 'image_url', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'status', // Add after 'status'
    });

    // Set default value for 'status' column
    await queryInterface.changeColumn('VideoUpload', 'status', {
      type: Sequelize.ENUM('pending', 'complete', 'failed'),
      defaultValue: 'pending',
      allowNull: false,
      after: 'image_url', // Add before 'createdAt'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('VideoUpload', 'image_url');

    await queryInterface.changeColumn('VideoUpload', 'status', {
      type: Sequelize.ENUM('pending', 'complete', 'failed'),
      defaultValue: null, 
      allowNull: false,
    });
  },
};
