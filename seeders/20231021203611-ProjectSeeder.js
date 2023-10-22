'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('projects', [
      {
        user_id: 1, 
        name: 'Proyecto 1',
        description: 'Descripción del proyecto 1',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 1, 
        name: 'Proyecto 2',
        description: 'Descripción del proyecto 2',
        created_at: new Date(),
        updated_at: new Date()
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('projects', null, {});
  }
};
