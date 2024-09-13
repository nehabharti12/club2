'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert roles into the user-roles table
    await queryInterface.bulkInsert('user-roles', [
      { roleName: 'ADMIN', createdAt: new Date(), updatedAt: new Date() },
      { roleName: 'STUDENT', createdAt: new Date(), updatedAt: new Date() },
      { roleName: 'COACH', createdAt: new Date(), updatedAt: new Date() },
      { roleName: 'PARENT', createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('user-roles', null, {});
  }
};
