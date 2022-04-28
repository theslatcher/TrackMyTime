const DataTypes = require('sequelize').DataTypes;
const sequelize = require('../db').db;

var User = sequelize.define('User', {
	username: {
		type: DataTypes.STRING,
		primaryKey: true
	},
	first_name: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			min: 1
		}
	},
	last_name: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			min: 1
		}
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true
		}
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false
	}
},
{
	timestamps: false,
    freezeTableName: true
});

User.removeAttribute('id');

User.schema('public');

module.exports = User;