'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('VideoUpload', 'video_url', {
      type: Sequelize.STRING(2048),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('VideoUpload', 'video_url', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
  }
};
