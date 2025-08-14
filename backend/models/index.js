const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

const User = require('./User')(sequelize);
const Offer = require('./Offer')(sequelize);
const RFQ = require('./RFQ')(sequelize);
const MarketData = require('./MarketData')(sequelize);
const Message = require('./Message')(sequelize);

module.exports = {
  sequelize,
  User,
  Offer,
  RFQ,
  MarketData,
  Message,
};
