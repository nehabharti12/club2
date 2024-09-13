'use strict';
const bcrypt = require('bcryptjs');
const uuid = require('uuid').v4;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword1 = await bcrypt.hash('12345678', 10);
    const hashedPassword2 = await bcrypt.hash('12345678', 10);

    const currentDate = new Date();

    await queryInterface.bulkInsert('users', [
      // {
      //   username: 'superadmin',
      //   firstname: 'Super',
      //   lastname: 'Admin',
      //   emailAddress: 'xornor@gmail.com',
      //   password: hashedPassword1,
      //   userType: '1',
      //   uuid: uuid(),
      //   createdAt: currentDate,
      //   updatedAt: currentDate
      // },
      // {
      //   username: 'user1',
      //   firstname: 'First',
      //   lastname: 'User',
      //   emailAddress: 'user1@example.com',
      //   password: hashedPassword2,
      //   userType: '1',
      //   uuid: uuid(),
      //   createdAt: currentDate,
      //   updatedAt: currentDate
      // },
      {
        username: 'Club_Admin',
        firstname: 'Club',
        lastname: 'Admin',
        emailAddress: 'club@gmail.com',
        password: hashedPassword1,
        userType: 1,
        uuid: uuid(),
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        username: 'CoachActivity',
        firstname: 'Coach',
        lastname: 'Admin',
        emailAddress: 'activity@gmail.com',
        password: hashedPassword1,
        userType: 2,
        uuid: uuid(),
        createdAt: currentDate,
        updatedAt: currentDate
      },
      {
        username: 'StudentActivity',
        firstname: 'Student',
        lastname: 'userStudent',
        emailAddress: 'student@gmail.com',
        password: hashedPassword1,
        userType: 3,
        uuid: uuid(),
        createdAt: currentDate,
        updatedAt: currentDate
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', { username: 'superadmin' }, {});
    await queryInterface.bulkDelete('users', { username: 'user1' }, {});
  }
};
