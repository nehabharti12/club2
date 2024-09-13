'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('club', 'openingTime', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('club', 'closingTime', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Reverse the changes made in the up method, if necessary.
    // For example, if the original type was TIME, you might revert it like this:
    await queryInterface.changeColumn('club', 'openingTime', {
      type: Sequelize.TIME,
      allowNull: true,
    });

    await queryInterface.changeColumn('club', 'closingTime', {
      type: Sequelize.TIME,
      allowNull: true,
    });
  }
};
