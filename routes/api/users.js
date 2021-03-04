const router = require('express').Router()
const bcrypt = require('bcryptjs')
const { User, Site } = require('../../db')
const { check, validationResult } = require('express-validator')
const trait = require('../trait')

/**
 * Get all users
 */
router.get('/', async(req, res) => {
    let users = await User.findAll({ include: 'site' })
    res.json(trait.success(users, 'ok'))
})

/**
 * Get a user
 */
router.get('/:userId', async(req, res) => {
    try {
        let user = await User.findOne({ where: { id: req.params.userId } })
        if (!user) throw { data: {}, msj: 'El usuario no existe' }

        res.json(trait.success(user, 'ok'))
    } catch (e) {
        res.json(trait.error(e.data, e.msj))
    }
})

/**
 * Create a user
 */
router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('name', 'El nombre debe tener mínimo 2 letras').isLength({ min: 2 }),
    check('lastname', 'El apellido es obligatorio').not().isEmpty(),
    check('lastname', 'El apellido debe tener mínimo 2 letras').isLength({ min: 2 }),
    check('password', 'La contraseña es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener mínimo 8 letras').isLength({ min: 8 }),
    check('email', 'El correo es obligatorio').not().isEmpty(),
    check('email', 'Debe ser un correo valido').isEmail(),
    check('siteId', 'La sede es obligatoria').not().isEmpty(),
    check('siteId', 'El valor de sede no es numerico').isInt({ min: 1 })
], async(req, res) => {
    try {
        let errors = validationResult(req)
        if (!errors.isEmpty()) throw { data: errors, msj: 'Error Validation' }

        let validateEmail = await User.findOne({ where: { email: req.body.email } })
        if (validateEmail) throw { data: {}, msj: 'Correo ya existe' }

        let site = await Site.findOne({ where: { id: req.body.siteId } })
        if (!site) throw { data: {}, msj: 'La sede no existe' }

        let usersSite = await User.findAll({ where: { siteId: req.body.siteId } })
        if (usersSite.length == 300) throw { data: {}, msj: 'Se puede un máximo de 300 clientes por sede' }

        req.body.password = bcrypt.hashSync(req.body.password, 10)
        let user = await User.create(req.body)

        res.json(trait.success(user, 'ok'))
    } catch (e) {
        res.json(trait.error(e.data, e.msj))
    }
})

/**
 * Update a user
 */
router.put('/:userId', [
    check('name', 'El nombre debe tener mínimo 2 letras').optional().isLength({ min: 2 }),
    check('lastname', 'El apellido debe tener mínimo 2 letras').optional().isLength({ min: 2 }),
    check('password', 'La contraseña debe tener mínimo 8 letras').optional().isLength({ min: 8 }),
    check('siteId', 'El valor de sede no es numerico').optional().isInt({ min: 1 }),
    check('email', 'Debe ser un correo valido').optional().isEmail()
], async(req, res) => {
    try {
        if (Object.values(req.body).length == 0) throw { data: {}, msj: 'El formulario esta vacio' }

        let errors = validationResult(req)
        if (!errors.isEmpty()) throw { data: errors, msj: 'Error Validation' }

        let user = await User.findOne({ where: { id: req.params.userId } })
        if (!user) throw { data: {}, msj: 'El usuario no existe' }

        if (req.body.email && (req.body.email !== user.email)) {
            let validateEmail = await User.findOne({ where: { email: req.body.email } })
            if (validateEmail) throw { data: {}, msj: 'El correo es de otro usuario' }
        }

        if (req.body.siteId && (req.body.siteId !== user.siteId)) {
            let site = await Site.findOne({ where: { id: req.body.siteId } })
            if (!site) throw { data: {}, msj: 'La sede no existe' }
        }

        if (req.body.password) req.body.password = bcrypt.hashSync(req.body.password, 10)

        await User.update(req.body, {
            where: { id: req.params.userId }
        })

        res.json(trait.success({}, 'ok'))
    } catch (e) {
        res.json(trait.error(e.data, e.msj))
    }
})

/**
 * Delete a user
 */
router.delete('/:userId', async(req, res) => {
    try {
        let user = await User.findOne({ where: { id: req.params.userId } })
        if (!user) throw { data: {}, msj: 'El usuario no existe' }

        await User.destroy({
            where: { id: req.params.userId }
        })
        res.json(trait.success({}, 'ok'))
    } catch (e) {
        res.json(trait.error(e.data, e.msj))
    }
})

module.exports = router