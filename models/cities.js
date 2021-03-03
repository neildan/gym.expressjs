const sequalize = require('sequelize');

module.exports = (sequelize, type) => {
    const City = sequelize.define('city', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: type.STRING,
            allowNull: false,
        }
    });
    return City;
};