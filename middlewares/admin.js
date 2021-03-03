const { User } = require('../db')
const trait = require('../routes/trait')

const checkAdmin = async(req, res, next) => {
    if (!req.userId) return res.json(trait.error({}, 'Id Usuario no encontrado', 405))

    let user = await User.findOne({ where: { id: req.userId } })
    if (!user) return res.json(trait.error({}, 'Usuario no encontrado', 405))

    if (!user.admin) return res.json(trait.error({}, 'El usuario no es administrador del sistema', 405))

    req.user = user
    next()
}

module.exports = {
    checkAdmin: checkAdmin
}