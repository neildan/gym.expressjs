const { User } = require('../db')

const checkAdmin = async(req, res, next) => {
    if (!req.userId) return res.json({ error: 'Id Usuario no encontrado' })
    let user = await User.findOne({ where: { id: req.userId } })
    if (!user) return res.json({ error: 'Usuario no encontrado' })
    if (!user.admin) return res.json({ error: 'El usuario no es administrador del sistema' })

    req.user = user
    next()
}

module.exports = {
    checkAdmin: checkAdmin
}