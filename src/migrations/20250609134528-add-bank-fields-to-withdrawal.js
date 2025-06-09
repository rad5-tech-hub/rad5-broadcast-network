'use strict';


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Withdrawals', 'bankName', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('Withdrawals', 'accountNumber', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('Withdrawals', 'accountName', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Withdrawals', 'bankName');
    await queryInterface.removeColumn('Withdrawals', 'accountNumber');
    await queryInterface.removeColumn('Withdrawals', 'accountName');
  },
};
