'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_user_activities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id:{
        type: Sequelize.INTEGER,
        default:null
      },
      
      ip: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      os: {
        type: Sequelize.STRING
      },
      browser: {
        type: Sequelize.STRING
      },
      platform: {
        type: Sequelize.STRING
      },
      method: {
        type: Sequelize.STRING
      },
      version: {
        type: Sequelize.STRING
      },
      route: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.INTEGER
      },
      time: {
        type: Sequelize.DATE
      },
      processTime: {
        type: Sequelize.STRING
      },
      requestObject: {
        type: Sequelize.JSON
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_activities');
  }
};
