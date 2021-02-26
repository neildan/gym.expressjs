const Sequelize = require('sequelize')

const UserModel = require('./models/users')

const sequelize = new Sequelize('LVnxuhynWT', 'LVnxuhynWT', 'D5KOZFXDl5', {
    host: 'remotemysql.com',
    dialect: 'mysql'
})

const User = UserModel(sequelize, Sequelize)

sequelize.sync({
    force: false
}).then(() => {
    console.log("Tablas sincronizadas")
})

module.exports = {
    User
}