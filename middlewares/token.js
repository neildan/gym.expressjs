const jwt = require('jwt-simple')
const moment = require('moment')
const trait = require('../routes/trait')

const ckeckToken = (req, res, next) => {
    if (!req.headers['user-token']) return res.json(trait.error({}, 'No hay user-token en cabecera', 401))
    let userToken = req.headers['user-token'],
        payload = {}

    try {
        payload = jwt.decode(userToken, 'testdevjs')
    } catch (err) {
        return res.json(trait.error(err, 'Token incorrecto', 401))
    }

    if (payload.expireAt < moment().unix()) return res.json(trait.error({}, 'Token expirado', 401))

    req.userId = payload.userId

    next()
}

module.exports = {
    ckeckToken: ckeckToken
}