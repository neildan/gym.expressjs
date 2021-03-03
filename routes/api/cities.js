const router = require('express').Router()
const { City } = require('../../db')
const { check, validationResult } = require('express-validator')
const trait = require('../trait')

/**
 * Get all cities
 */
router.get('/', async(req, res) => {
    let cities = await City.findAll()
    res.json(trait.success(cities, 'ok'))
})

/**
 * Get a citiy
 */
router.get('/:cityId', async(req, res) => {
    try {
        let city = await City.findOne({ where: { id: req.params.cityId } })
        if (!city) throw { data: {}, msj: 'La ciudad no existe' }

        res.json(trait.success(city, 'ok'))
    } catch (e) {
        res.json(trait.error(e.data, e.msj))
    }
})

/**
 * Create a city
 */
router.post('/', [
    check('name', 'El nombre es obligatorio con minimo 2 letras').not().isEmpty().isLength({ min: 2 }),
], async(req, res) => {
    try {
        let errors = validationResult(req)
        if (!errors.isEmpty()) throw { data: errors, msj: 'Error Validation' }

        let city = await City.create(req.body)
        res.json(trait.success(city, 'ok'))
    } catch (e) {
        res.json(trait.error(e.data, e.msj))
    }
})

/**
 * Update a city
 */
router.put('/:cityId', [
    check('name', 'El campo nombre no puede tener menos de 2 caracteres').optional().isLength({ min: 2 }),
], async(req, res) => {
    try {
        let errors = validationResult(req)
        if (!errors.isEmpty()) throw { data: errors, msj: 'Error Validation' }

        let city = await City.findOne({ where: { id: req.params.cityId } })
        if (!city) throw { data: {}, msj: 'La ciudad no existe' }

        await City.update(req.body, {
            where: { id: req.params.cityId }
        })
        res.json(trait.success({}, 'ok'))
    } catch (e) {
        res.json(trait.error(e.data, e.msj))
    }
})

/**
 * Delete a city
 */
router.delete('/:cityId', async(req, res) => {
    try {
        let city = await City.findOne({ where: { id: req.params.cityId } })
        if (!city) throw { data: {}, msj: 'La ciudad no existe' }

        await City.destroy({
            where: { id: req.params.cityId }
        })
        res.json(trait.success({}, 'ok'))
    } catch (e) {
        res.json(trait.error(e.data, e.msj))
    }
})

module.exports = router