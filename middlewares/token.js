const jwt = require('jwt-simple')
const moment = require('moment')

const ckeckToken = (req, res, next) => {
    if (!req.headers['user-token']) return res.json({ error: 'No hay user-token en cabecera' })
    let userToken = req.headers['user-token'],
        payload = {}

    try {
        payload = jwt.decode(userToken, 'testdevjs')
    } catch (err) {
        return res.json({ error: 'Token incorrecto' })
    }

    if (payload.expireAt < moment().unix()) {
        return res.json({ error: 'Token expirado' })
    }

    req.userId = payload.userId

    next()
}

module.exports = {
    ckeckToken: ckeckToken
}