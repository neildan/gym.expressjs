const router = require('express').Router()
const bcrypt = require('bcryptjs')
const { User } = require('../../db')
const { check, validationResult } = require('express-validator')
const moment = require('moment')
const jwt = require('jwt-simple')
const trait = require('../trait')

/**
 * Register a user
 */
router.post('/register', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('name', 'El nombre debe tener mínimo 2 letras').isLength({ min: 2 }),
    check('lastname', 'El apellido es obligatorio').not().isEmpty(),
    check('lastname', 'El apellido debe tener mínimo 2 letras').isLength({ min: 2 }),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('password', 'La contraseña debe tener mínimo 8 letras').isLength({ min: 8 }),
    check('email', 'El correo es obligatorio').not().isEmpty(),
    check('email', 'Debe ser un correo valido').isEmail()
], async(req, res) => {
    try {
        let errors = validationResult(req)
        if (!errors.isEmpty()) throw { data: errors, msj: 'Error Validation' }

        let validateEmail = await User.findOne({ where: { email: req.body.email } })
        if (validateEmail) throw { data: {}, msj: 'Correo ya existe' }

        req.body.password = bcrypt.hashSync(req.body.password, 10)
        let user = await User.create(req.body)

        res.json(trait.success(user, 'ok'))
    } catch (e) {
        res.json(trait.error(e.data, e.msj))
    }
})

/**
 * Validate the user's login
 */
router.post('/login', [
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('password', 'La contraseña debe tener mínimo 8 letras').isLength({ min: 8 }),
    check('email', 'El correo es obligatorio').not().isEmpty(),
    check('email', 'Debe ser un correo valido').isEmail()
], async(req, res) => {
    try {
        let errors = validationResult(req)
        if (!errors.isEmpty()) throw { data: errors, msj: 'Error Validation' }

        let user = await User.findOne({ where: { email: req.body.email } })
        if (!user) throw { data: {}, msj: 'Correo no existe' }

        if (!bcrypt.compareSync(req.body.password, user.password)) throw { data: {}, msj: 'Contraseña incorrecta' }

        res.json(trait.success({
            token: createToken(user),
            username: user.name + ' ' + user.lastname,
            admin: user.admin
        }, 'ok'))
    } catch (e) {
        res.json(trait.error(e.data, e.msj))
    }
})

/**
 * Create a token
 */
const createToken = (user) => {
    let payload = {
        userId: user.id,
        createAt: moment().unix(),
        expireAt: moment().add(8, 'hours').unix()
    }
    return jwt.encode(payload, 'testdevjs')
}

module.exports = router