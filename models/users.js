const sequelize = require("sequelize");

module.exports = (sequelize, type) => {
    return sequelize.define('user', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: type.STRING,
        lastname: type.STRING,
        admin: type.BOOLEAN
    });
}