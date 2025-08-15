'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      "ALTER TYPE \"enum_Offers_status\" ADD VALUE IF NOT EXISTS 'rejected';"
    );
  },

  async down(queryInterface) {
    // Sequelize doesn't support removing enum values easily; recreate type
    await queryInterface.sequelize.query(
      "CREATE TYPE \"enum_Offers_status_old\" AS ENUM('pending','approved','featured');"
    );
    await queryInterface.sequelize.query(
      "ALTER TABLE \"Offers\" ALTER COLUMN \"status\" TYPE \"enum_Offers_status_old\" USING \"status\"::text::\"enum_Offers_status_old\";"
    );
    await queryInterface.sequelize.query(
      'DROP TYPE "enum_Offers_status";'
    );
    await queryInterface.sequelize.query(
      'ALTER TYPE "enum_Offers_status_old" RENAME TO "enum_Offers_status";'
    );
  },
};
