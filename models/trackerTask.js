const DataTypes = require('sequelize').DataTypes;
const sequelize = require('../db').db;

var TrackerTask = sequelize.define('TrackerTask', {
    trackerid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    color: DataTypes.STRING,
    goal: DataTypes.INTEGER,
    currenttime: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    username: {
        type: DataTypes.STRING,
        references: 'User',
        referencesKey: 'username'
    }
},
{
    timestamps: false,
    freezeTableName: true
});

TrackerTask.removeAttribute('id');

TrackerTask.schema('public');

module.exports = TrackerTask;