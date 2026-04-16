import User from './User.js';
import Store from './Store.js';
import Rating from './Rating.js';

// Store <-> User
Store.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
User.hasOne(Store, { foreignKey: 'owner_id', as: 'managedStore' });

// User <-> Rating
User.hasMany(Rating, { foreignKey: 'user_id' });
Rating.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Store <-> Rating
Store.hasMany(Rating, { foreignKey: 'store_id' });
Rating.belongsTo(Store, { foreignKey: 'store_id' });

export { User, Store, Rating };