'use strict';
require('dotenv').config();
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(process.env.FIRST_PASSWORD_USER, salt);
    await queryInterface.bulkInsert('users', [
      {
        username: 'Fenner',
        email: 'fenner@evol.com.co',
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        username: 'user2',
        email: 'user2@example.com',
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
