import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Rating = sequelize.define('Rating', {
    rating_value: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    store_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Stores',
            key: 'id'
        }
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'store_id']
        }
    ]
});

export default Rating;