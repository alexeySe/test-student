'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Grades', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false
      },
      grade: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      personalCode: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Students',
          key: 'personalCode'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });

    await queryInterface.addConstraint('Grades', {
      fields: ['personalCode'],
      type: 'foreign key',
      name: 'FK_Grades_Students_personalCode', 
      references: {
        table: 'Students',
        field: 'personalCode'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
