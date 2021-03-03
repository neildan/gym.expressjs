const router = require('express').Router()
const { Site, City, User } = require('../../db')
const { check, validationResult } = require('express-validator')
const trait = require('../trait')

/**
 * Get all sites
 */
router.get('/', async(req, res) => {
    let sites = await Site.findAll({ include: 'city' })
    res.json(trait.success(sites, 'ok'))
})

/**
 * Get a site
 */
router.get('/:siteId', async(req, res) => {
    try {
        let site = await Site.findOne({ where: { id: req.params.siteId } })
        if (!site) throw { data: {}, msj: 'La sede no existe' }

        res.json(trait.success(site, 'ok'))
    } catch (e) {
        res.json(trait.error(e.data, e.msj))
    }
})

/**
 * Get all users of a site
 */
router.get('/users/:siteId', async(req, res) => {
    try {
        let users = await User.findAll({ where: { siteId: req.params.siteId } })
        if (!users) throw { data: {}, msj: 'No hay usuarios en esa sede' }

        res.json(trait.success(users, 'ok'))
    } catch (e) {
        res.json(trait.error(e.data, e.msj))
    }
})

/**
 * Create a site
 */
router.post('/', [
    check('address', 'La dirección es obligatoria con minimo 4 letras').not().isEmpty().isLength({ min: 4 }),
    check('cityId', 'La cuidad es obligatoria').not().isEmpty()
], async(req, res) => {
    try {
        let errors = validationResult(req)
        if (!errors.isEmpty()) throw { data: errors, msj: 'Error Validation' }

        let city = await City.findOne({ where: { id: req.body.cityId } })
        if (!city) throw { data: {}, msj: 'La ciudad no existe' }

        let site = await Site.create(req.body)

        res.json(trait.success(site, 'ok'))
    } catch (e) {
        res.json(trait.error(e.data, e.msj))
    }
})

/**
 * Update a site
 */
router.put('/:siteId', [
    check('address', 'La dirección no puede tener menos de 4 caracteres').optional().isLength({ min: 4 }),
    check('cityId', 'La ciudad no puede estar vacia').optional().isInt({ min: 1 })
], async(req, res) => {
    try {
        let errors = validationResult(req)
        if (!errors.isEmpty()) throw { data: errors, msj: 'Error Validation' }

        if (req.body.cityId) {
            let city = await City.findOne({ where: { id: req.body.cityId } })
            if (!city) throw { data: {}, msj: 'La ciudad no existe' }
        }

        let site = await Site.findOne({ where: { id: req.params.siteId } })
        if (!site) throw { data: {}, msj: 'La sede no existe' }

        await Site.update(req.body, {
            where: { id: req.params.siteId }
        })
        res.json(trait.success({}, 'ok'))
    } catch (e) {
        res.json(trait.error(e.data, e.msj))
    }
})

/**
 * Delete a site
 */
router.delete('/:siteId', async(req, res) => {
    try {
        let site = await Site.findOne({ where: { id: req.params.siteId } })
        if (!site) throw { data: {}, msj: 'La sede no existe' }

        await Site.destroy({
            where: { id: req.params.siteId }
        })
        res.json(trait.success({}, 'ok'))
    } catch (e) {
        res.json(trait.error(e.data, e.msj))
    }
})

module.exports = router