'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add 'title' and 'description' columns after 'status'
    await queryInterface.sequelize.query(`
      ALTER TABLE \`VideoUpload\`
      ADD COLUMN \`title\` VARCHAR(255) NULL AFTER \`status\`,
      ADD COLUMN \`description\` VARCHAR(255) NULL AFTER \`title\`
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove 'title' and 'description' columns
    await queryInterface.sequelize.query(`
      ALTER TABLE \`VideoUpload\`
      DROP COLUMN \`title\`,
      DROP COLUMN \`description\`
    `);
  }
};
