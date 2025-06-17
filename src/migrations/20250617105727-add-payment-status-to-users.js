'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'paymentStatus', {
      type: Sequelize.ENUM('paid', 'unpaid'),
      allowNull: false,
      defaultValue: 'unpaid',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'paymentStatus');
  },
};
