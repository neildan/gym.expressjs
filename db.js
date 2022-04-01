const Sequelize = require('sequelize')

const UserModel = require('./models/users')
const CityModel = require('./models/cities')
const SiteModel = require('./models/sites')

const sequelize = new Sequelize('dbonlinedaniel', 'dbonlinedaniel', 'dbonlinedaniel', {
    host: 'db4free.net',
    dialect: 'mysql',
    logging: false
})

const User = UserModel(sequelize, Sequelize)
const City = CityModel(sequelize, Sequelize)
const Site = SiteModel(sequelize, Sequelize)

sequelize.sync({
    force: false
}).then(() => {
    console.log("Tablas sincronizadas")
})

module.exports = {
    User,
    City,
    Site
}