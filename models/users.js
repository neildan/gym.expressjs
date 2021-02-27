const sequelize = require("sequelize");

module.exports = (sequelize, type) => {
    const User = sequelize.define('user', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: type.STRING,
            allowNull: false,
        },
        lastname: {
            type: type.STRING,
            allowNull: false,
        },
        admin: {
            type: type.BOOLEAN,
            defaultValue: false,
        },
        email: {
            type: type.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: type.STRING(150),
            allowNull: false
        },
        idSite: {
            type: type.INTEGER,
            allowNull: true,
        }
    }, {
        classMethods: {
            associate(models) {
                User.belongsTo(models.Site, {
                    foreignKey: {
                        name: 'idSite',
                        allowNull: true,
                    },
                });
            },
        },
    });
    return User;
};