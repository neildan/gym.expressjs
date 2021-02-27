const sequalize = require('sequelize')

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
        },
        idCity: {
            type: type.INTEGER,
            allowNull: false,
        }
    }, {
        classMethods: {
            associate(models) {
                Site.belongsTo(models.City, {
                    foreignKey: {
                        name: 'idCity',
                        allowNull: false,
                    },
                });
            },
        },
    });
    return Site;
};