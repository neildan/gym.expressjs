const router = require('express').Router()
const bcrypt = require('bcryptjs')
const { User, Site } = require('../../db')
const { check, validationResult } = require('express-validator')
const moment = require('moment')
const jwt = require('jwt-simple')

/**
 * Get all users
 */
router.get('/', async(req, res) => {
    let users = await User.findAll()
    res.json(users)
})

/**
 * Create a user
 */
router.post('/register', [
    check('name', 'El nombre es obligatorio con minimo 2 letras').not().isEmpty().isLength({ min: 2 }),
    check('lastname', 'El apellido es obligatorio con minimo 2 letras').not().isEmpty().isLength({ min: 2 }),
    check('password', 'La contraseña es obligatorio con minimo 8 letras').not().isEmpty().isLength({ min: 8 }),
    check('idSite', 'El campo sede debe ser númerico').optional().isInt({ min: 1 }),
    check('email', 'Debe ser un correo valido').isEmail()
], async(req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() })
    req.body.password = bcrypt.hashSync(req.body.password, 10)
    if (req.body.idSite) {
        let site = await Site.findOne({ where: { id: req.body.idSite } })
        if (!site) return res.json({ error: 'No se encontro esa sede' })
    }
    let user = await User.create(req.body)
    res.json(user)
})

/**
 * Validate the user's login
 */
router.post('/login', async(req, res) => {
    const user = await User.findOne({ where: { email: req.body.email } })
    let response;
    if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
            response = createToken(user)
        } else {
            response = 'Error usuario y/o contraseña'
        }
    } else {
        response = 'Error usuario y/o contraseña'
    }
    res.json({ response: response })
})

/**
 * Create a token
 */
const createToken = (user) => {
    const payload = {
        userId: user.id,
        createAt: moment().unix(),
        expireAt: moment().add(8, 'hours').unix()
    }
    return jwt.encode(payload, 'testdevjs')
}

/**
 * Update a user
 */
router.put('/:userId', [
    check('name', 'El campo nombre no puede tener menos de 2 caracteres').optional().isLength({ min: 2 }),
    check('lastname', 'El campo apellido no puede tener menos de 2 caracteres').optional().isLength({ min: 2 }),
    check('password', 'El campo contraseña no puede tener menos de 8 caracteres').optional().isLength({ min: 8 }),
    check('idSite', 'El campo sede debe ser númerico').optional().isInt({ min: 1 }),
    check('email', 'Debe ser un correo valido').optional().isEmail()
], async(req, res) => {
    if (Object.values(req.body).length == 0) return res.json({ error: 'El formulario esta vacio' })
    let errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() })

    if (req.body.idSite) {
        let site = await Site.findOne({ where: { id: req.body.idSite } })
        if (!site) return res.json({ error: 'No se encontro esa sede' })
    }

    await User.update(req.body, {
        where: { id: req.params.userId }
    })
    res.json({ success: 'Se ha modificado' })
})

/**
 * Delete a user
 */
router.delete('/:userId', async(req, res) => {
    await User.destroy({
        where: { id: req.params.userId }
    })
    res.json({ success: 'Se ha borrado' })
})

module.exports = router