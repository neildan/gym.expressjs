const router = require('express').Router()
const { City } = require('../../db')
const { check, validationResult } = require('express-validator')

/**
 * Get all cities
 */
router.get('/', async(req, res) => {
    let cities = await City.findAll()
    res.json(cities)
})

/**
 * Create a city
 */
router.post('/', [
    check('name', 'El nombre es obligatorio con minimo 2 letras').not().isEmpty().isLength({ min: 2 }),
], async(req, res) => {
    let error = validationResult(req);
    if (!error.isEmpty()) return res.status(422).json({ error: error.array() })
    let city = await City.create(req.body)
    res.json(city)
})

/**
 * Update a city
 */
router.put('/:cityId', [
    check('name', 'El campo nombre no puede tener menos de 2 caracteres').optional().isLength({ min: 2 }),
], async(req, res) => {
    let error = validationResult(req);
    if (!error.isEmpty()) return res.status(422).json({ error: error.array() })
    await City.update(req.body, {
        where: { id: req.params.cityId }
    })
    res.json({ success: 'Se ha modificado' })
})

/**
 * Delete a city
 */
router.delete('/:cityId', async(req, res) => {
    await City.destroy({
        where: { id: req.params.cityId }
    })
    res.json({ success: 'Se ha borrado' })
})

module.exports = router