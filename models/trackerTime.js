const DataTypes = require('sequelize').DataTypes;
const sequelize = require('../db').db;

var TrackerTime = sequelize.define('TrackerTime', {
    trackerid: {
        type: DataTypes.INTEGER,
        references: 'TrackerTask',
        referencesKey: 'trackerid',
        field: 'trackerid'
    },
    totaltime: DataTypes.STRING,
    dayofyear: DataTypes.DATE
},
{
    timestamps: false,
    freezeTableName: true
});

TrackerTime.removeAttribute('id');

TrackerTime.schema('public');

module.exports = TrackerTime;