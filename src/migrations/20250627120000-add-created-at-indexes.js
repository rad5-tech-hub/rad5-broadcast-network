'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('Agents', ['createdAt']);
    await queryInterface.addIndex('Withdrawals', ['createdAt']);
    await queryInterface.addIndex('Users', ['createdAt']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('Agents', ['createdAt']);
    await queryInterface.removeIndex('Withdrawals', ['createdAt']);
    await queryInterface.removeIndex('Users', ['createdAt']);
  }
};
