'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE club
      ADD COLUMN activity JSON NULL AFTER uuid,
      ADD COLUMN location VARCHAR(255) NULL AFTER activity,  -- Changed to VARCHAR
      ADD COLUMN openingTime TIME NULL AFTER location,
      ADD COLUMN closingTime TIME NULL AFTER openingTime;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE club
      DROP COLUMN closingTime,
      DROP COLUMN openingTime,
      DROP COLUMN location,
      DROP COLUMN activity;
    `);
  }
};
