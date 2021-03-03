const sequalize = require('sequelize');

module.exports = (sequelize, type) => {
    const Site = sequelize.define('site', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        address: {
            type: type.STRING,
            allowNull: false,
        }
    });
    return Site;
};