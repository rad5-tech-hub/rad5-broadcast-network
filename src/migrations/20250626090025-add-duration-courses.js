'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Courses', 'courseDuration', {
      type: Sequelize.STRING,
      allowNull: false, 
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Courses', 'courseDuration');
  },
};
