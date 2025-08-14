const sequelize = require('../config/database');

const User = require('./User')(sequelize);
const Offer = require('./Offer')(sequelize);
const RFQ = require('./RFQ')(sequelize);
const MarketData = require('./MarketData')(sequelize);
const Message = require('./Message')(sequelize);

// Associations
User.hasMany(Offer, { foreignKey: 'userId' });
Offer.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(RFQ, { foreignKey: 'userId' });
RFQ.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Message, { as: 'sentMessages', foreignKey: 'fromUserId' });
User.hasMany(Message, { as: 'receivedMessages', foreignKey: 'toUserId' });
Message.belongsTo(User, { as: 'fromUser', foreignKey: 'fromUserId' });
Message.belongsTo(User, { as: 'toUser', foreignKey: 'toUserId' });

Offer.hasMany(Message, { foreignKey: 'offerId' });
Message.belongsTo(Offer, { foreignKey: 'offerId' });

RFQ.hasMany(Message, { foreignKey: 'rfqId' });
Message.belongsTo(RFQ, { foreignKey: 'rfqId' });

module.exports = {
  sequelize,
  User,
  Offer,
  RFQ,
  MarketData,
  Message,
};
