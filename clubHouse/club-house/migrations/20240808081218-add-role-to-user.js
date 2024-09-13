'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Use raw SQL to add the 'role' column
    await queryInterface.sequelize.query(`
      ALTER TABLE users
      ADD COLUMN role VARCHAR(255) NULL AFTER userType;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Use raw SQL to remove the 'role' column
    await queryInterface.sequelize.query(`
      ALTER TABLE users
      DROP COLUMN role;
    `);
  }
};
