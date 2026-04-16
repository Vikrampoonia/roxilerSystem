import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: { isEmail: true } 
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(400),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('System Administrator', 'Normal User', 'Store Owner'),
        defaultValue: 'Normal User',
    }
});

export default User;